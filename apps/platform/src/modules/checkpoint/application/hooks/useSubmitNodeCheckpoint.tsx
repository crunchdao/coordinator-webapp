"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import {
  getCoordinatorProgram,
  CrunchServiceWithContext,
  Prize,
} from "@crunchdao/sdk";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import { useTransactionExecutor } from "@/modules/wallet/application/hooks/useTransactionExecutor";
import { useMultisigProposalTracker } from "@/modules/wallet/application/context/multisigProposalTrackerContext";
import { useRouter } from "next/navigation";
import { generateLink } from "@crunch-ui/utils";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { INTERNAL_LINKS } from "@/utils/routes";
import { NodeCheckpoint } from "../../domain/nodeTypes";
import { confirmNodeCheckpoint } from "../../infrastructure/nodeService";

const FRAC64_MULTIPLIER = 1_000_000_000;

/**
 * Convert a node checkpoint's emission data into SDK Prize[] format.
 * Distributes payoutAmount proportionally based on frac64 emission percentages.
 */
function nodeCheckpointToPrizes(
  checkpoint: NodeCheckpoint,
  payoutAmount: number
): Prize[] {
  const emission = checkpoint.entries[0];
  if (!emission) return [];

  const ranking = checkpoint.meta.ranking ?? [];
  const timestamp = Math.floor(
    new Date(checkpoint.period_end).getTime() / 1000
  );

  return emission.cruncher_rewards.map((reward) => {
    const pct = reward.reward_pct / FRAC64_MULTIPLIER;
    const modelId =
      reward.cruncher_index < ranking.length
        ? ranking[reward.cruncher_index].model_id
        : String(reward.cruncher_index);

    return {
      prizeId: `${checkpoint.id}-${modelId}`,
      timestamp,
      model: modelId,
      prize: Math.round(payoutAmount * pct),
    };
  });
}

interface SubmitParams {
  checkpoint: NodeCheckpoint;
  payoutAmount: number;
}

/**
 * Takes a pending node checkpoint, converts its emission data to prizes,
 * and submits it on-chain. Confirms back to the node with the tx hash.
 */
export function useSubmitNodeCheckpoint() {
  const queryClient = useQueryClient();
  const { anchorProvider } = useAnchorProvider();
  const { crunchName } = useCrunchContext();
  const { executeTransaction, authority, isMultisigMode } =
    useTransactionExecutor();
  const { trackProposal } = useMultisigProposalTracker();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async ({ checkpoint, payoutAmount }: SubmitParams) => {
      if (!anchorProvider || !authority) {
        throw new Error("Wallet not connected");
      }

      const program = getCoordinatorProgram(anchorProvider);
      const crunchService = CrunchServiceWithContext({ program });

      // Convert node emission → SDK Prize[]
      const prizes = nodeCheckpointToPrizes(checkpoint, payoutAmount);
      if (prizes.length === 0) {
        throw new Error("No prizes in this checkpoint");
      }

      // Resolve on-chain cruncher addresses
      const preparedPrizes = await crunchService.checkpointPreparePrizes(
        crunchName,
        prizes
      );

      // Build and send on-chain transaction
      const instructions = await crunchService.checkpointCreate(
        crunchName,
        preparedPrizes,
        authority
      );

      const result = await executeTransaction({
        instructions,
        memo: `Checkpoint ${checkpoint.id} for ${crunchName}`,
      });

      return {
        ...result,
        nodeCheckpointId: checkpoint.id,
      };
    },
    onSuccess: (result) => {
      const handleSuccess = async () => {
        // Confirm back to the node
        if (result.signature) {
          try {
            await confirmNodeCheckpoint(
              crunchName,
              result.nodeCheckpointId,
              result.signature
            );
          } catch (err) {
            console.warn("Failed to confirm checkpoint to node:", err);
          }
        }

        queryClient.invalidateQueries({
          queryKey: ["node-checkpoints", crunchName],
        });
        queryClient.invalidateQueries({ queryKey: ["checkpoints"] });

        toast({
          title: "Checkpoint submitted",
          description: `Checkpoint "${result.nodeCheckpointId}" submitted on-chain.`,
        });

        router.push(
          generateLink(INTERNAL_LINKS.CHECKPOINTS, {
            crunchname: crunchName,
          })
        );
      };

      if (result.isMultisig && result.transactionIndex && result.multisigPda) {
        trackProposal({
          multisigPda: result.multisigPda,
          transactionIndex: result.transactionIndex,
          memo: `Checkpoint ${result.nodeCheckpointId} for ${crunchName}`,
          proposalUrl: result.proposalUrl,
          signature: result.signature,
          onExecuted: handleSuccess,
        });
      } else {
        handleSuccess();
      }
    },
    onError: (error) => {
      console.error("Submit checkpoint error:", error);
      toast({
        title: "Failed to submit checkpoint",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    submitNodeCheckpoint: mutation.mutateAsync,
    submitLoading: mutation.isPending,
    isMultisigMode,
  };
}
