import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import {
  getCoordinatorProgram,
  CrunchServiceWithContext,
} from "@crunchdao/sdk";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import { useTransactionExecutor } from "@/modules/wallet/application/hooks/useTransactionExecutor";
import { PublicKey } from "@solana/web3.js";

interface FundCrunchParams {
  crunchAddress: PublicKey;
  amount: number;
}

export const useFundCrunch = () => {
  const queryClient = useQueryClient();
  const { anchorProvider } = useAnchorProvider();
  const { executeTransaction, authority, isMultisigMode } = useTransactionExecutor();

  const mutation = useMutation({
    mutationFn: async ({ crunchAddress, amount }: FundCrunchParams) => {
      if (!anchorProvider || !authority) {
        throw new Error("Wallet not connected");
      }

      const coordinatorProgram = getCoordinatorProgram(anchorProvider);
      const crunchService = CrunchServiceWithContext({
        program: coordinatorProgram,
      });

      // Convert USDC to micro-USDC (6 decimals)
      const amountInMicroUsdc = Math.floor(amount * 1_000_000);

      // Use authority (vault in multisig mode, wallet otherwise) as the signer
      const instruction = await crunchService.depositRewardUsdcInstruction(
        crunchAddress,
        amountInMicroUsdc,
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
      };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["coordinator-crunches"] });
      queryClient.invalidateQueries({ queryKey: ["reward-vault-balance"] });

      if (result.isMultisig) {
        toast({
          title: "Multisig proposal created",
          description: `Proposal to fund ${result.amount} USDC has been submitted for approval.`,
        });
      } else {
        toast({
          title: "Crunch funded successfully",
          description: `Added ${result.amount} USDC to the reward vault.`,
        });
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
