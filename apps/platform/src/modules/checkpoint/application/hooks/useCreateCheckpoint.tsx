"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import {
  getCoordinatorProgram,
  CrunchServiceWithContext,
  PreparedPrize,
} from "@crunchdao/sdk";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import { useTransactionExecutor } from "@/modules/wallet/application/hooks/useTransactionExecutor";
import { useMultisigProposalTracker } from "@/modules/wallet/application/context/multisigProposalTrackerContext";
import { useRouter } from "next/navigation";
import { generateLink } from "@crunch-ui/utils";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { INTERNAL_LINKS } from "@/utils/routes";

export function useCreateCheckpoint() {
  const queryClient = useQueryClient();
  const { anchorProvider } = useAnchorProvider();
  const { crunchName } = useCrunchContext();
  const { executeTransaction, authority, isMultisigMode } =
    useTransactionExecutor();
  const { trackProposal } = useMultisigProposalTracker();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (preparedPrizes: PreparedPrize[]) => {
      if (!anchorProvider || !authority) {
        throw new Error("Wallet not connected");
      }

      const program = getCoordinatorProgram(anchorProvider);
      const crunchService = CrunchServiceWithContext({ program });

      const instructions = await crunchService.checkpointCreate(
        crunchName,
        preparedPrizes,
        authority
      );

      const result = await executeTransaction({
        instructions,
        memo: `Create checkpoint for ${crunchName}`,
      });

      return {
        signature: result.signature,
        isMultisig: result.isMultisig,
        proposalUrl: result.proposalUrl,
        transactionIndex: result.transactionIndex,
        multisigPda: result.multisigPda,
      };
    },
    onSuccess: (result) => {
      const handleSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["crunch-detail", crunchName] });
        toast({
          title: "Checkpoint created",
          description: `Checkpoint for "${crunchName}" has been created.`,
        });
        router.push(
          generateLink(INTERNAL_LINKS.CHECKPOINTS, { crunchname: crunchName })
        );
      };

      if (result.isMultisig && result.transactionIndex && result.multisigPda) {
        trackProposal({
          multisigPda: result.multisigPda,
          transactionIndex: result.transactionIndex,
          memo: `Create checkpoint for ${crunchName}`,
          proposalUrl: result.proposalUrl,
          signature: result.signature,
          onExecuted: handleSuccess,
        });
      } else {
        handleSuccess();
      }
    },
    onError: (error) => {
      console.error("Create checkpoint error:", error);
      toast({
        title: "Failed to create checkpoint",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    createCheckpoint: mutation.mutateAsync,
    createCheckpointLoading: mutation.isPending,
    isMultisigMode,
  };
}
