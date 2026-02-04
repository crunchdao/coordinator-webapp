import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import {
  getCoordinatorProgram,
  CrunchServiceWithContext,
} from "@crunchdao/sdk";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import { useTransactionExecutor } from "@/modules/wallet/application/hooks/useTransactionExecutor";
import { useMultisigProposalTracker } from "@/modules/wallet/application/context/multisigProposalTrackerContext";
import { PublicKey } from "@solana/web3.js";

interface FundCrunchParams {
  crunchAddress: PublicKey;
  amount: number;
}

export const useFundCrunch = () => {
  const queryClient = useQueryClient();
  const { anchorProvider } = useAnchorProvider();
  const { executeTransaction, authority, isMultisigMode } =
    useTransactionExecutor();
  const { trackProposal } = useMultisigProposalTracker();

  const mutation = useMutation({
    mutationFn: async ({ crunchAddress, amount }: FundCrunchParams) => {
      if (!anchorProvider || !authority) {
        throw new Error("Wallet not connected");
      }

      const coordinatorProgram = getCoordinatorProgram(anchorProvider);
      const crunchService = CrunchServiceWithContext({
        program: coordinatorProgram,
      });

      // depositRewardUsdcInstruction handles USDC → micro-USDC conversion internally
      const instruction = await crunchService.depositRewardUsdcInstruction(
        crunchAddress,
        amount,
        authority
      );

      const result = await executeTransaction({
        instructions: [instruction],
        memo: `Fund crunch with ${amount} USDC`,
      });

      return {
        success: true,
        txHash: result.signature,
        amount,
        isMultisig: result.isMultisig,
        proposalUrl: result.proposalUrl,
        transactionIndex: result.transactionIndex,
        multisigPda: result.multisigPda,
      };
    },
    onSuccess: (result) => {
      const handleSuccess = () => {
        queryClient.invalidateQueries({
          queryKey: ["coordinator-crunches"],
        });
        queryClient.invalidateQueries({
          queryKey: ["reward-vault-balance"],
        });
        toast({
          title: "Crunch funded successfully",
          description: `Added ${result.amount} USDC to the reward vault.`,
        });
      };

      if (result.isMultisig && result.transactionIndex && result.multisigPda) {
        trackProposal({
          multisigPda: result.multisigPda,
          transactionIndex: result.transactionIndex,
          memo: `Fund crunch with ${result.amount} USDC`,
          proposalUrl: result.proposalUrl,
          signature: result.txHash,
          onExecuted: handleSuccess,
        });
      } else {
        handleSuccess();
      }
    },
    onError: (error) => {
      console.error("Fund crunch error:", error);
      toast({
        title: "Failed to fund crunch",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  return {
    fundCrunch: mutation.mutate,
    fundCrunchAsync: mutation.mutateAsync,
    fundCrunchLoading: mutation.isPending,
    fundCrunchError: mutation.error,
    isMultisigMode,
  };
};
