import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import {
  getCoordinatorProgram,
  CrunchServiceWithContext,
} from "@crunchdao/sdk";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";

interface FundCrunchParams {
  crunchAddress: PublicKey;
  amount: number;
}

export const useFundCrunch = () => {
  const queryClient = useQueryClient();
  const { anchorProvider } = useAnchorProvider();
  const { publicKey } = useWallet();

  const mutation = useMutation({
    mutationFn: async ({ crunchAddress, amount }: FundCrunchParams) => {
      if (!anchorProvider || !publicKey) {
        throw new Error("Wallet not connected");
      }

      const coordinatorProgram = getCoordinatorProgram(anchorProvider);
      const crunchService = CrunchServiceWithContext({
        program: coordinatorProgram,
      });

      // Convert USDC to micro-USDC (6 decimals)
      const amountInMicroUsdc = Math.floor(amount * 1_000_000);

      const instruction = await crunchService.depositRewardUsdcInstruction(
        crunchAddress,
        amountInMicroUsdc,
        publicKey
      );

      const transaction = new Transaction();
      transaction.add(instruction);

      const { blockhash } = await anchorProvider.connection.getLatestBlockhash(
        "confirmed"
      );
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const txHash = await anchorProvider.sendAndConfirm(transaction);

      return { success: true, txHash, amount };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["coordinator-crunches"] });
      toast({
        title: "Crunch funded successfully",
        description: `Added ${result.amount} USDC to the reward vault.`,
      });
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
  };
};
