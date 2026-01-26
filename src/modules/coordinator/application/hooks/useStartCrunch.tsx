import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import {
  getCoordinatorProgram,
  CrunchServiceWithContext,
} from "@crunchdao/sdk";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import { useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";

interface StartCrunchParams {
  crunchName: string;
}

export const useStartCrunch = () => {
  const queryClient = useQueryClient();
  const { anchorProvider } = useAnchorProvider();
  const { publicKey } = useWallet();

  const mutation = useMutation({
    mutationFn: async ({ crunchName }: StartCrunchParams) => {
      if (!anchorProvider || !publicKey) {
        throw new Error("Wallet not connected");
      }

      const coordinatorProgram = getCoordinatorProgram(anchorProvider);
      const crunchService = CrunchServiceWithContext({
        program: coordinatorProgram,
      });

      const { instructions, partialSigners } =
        await crunchService.startCrunchInstruction(crunchName, publicKey);

      const transaction = new Transaction();
      transaction.add(...instructions);

      const { blockhash } = await anchorProvider.connection.getLatestBlockhash(
        "confirmed"
      );
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      if (partialSigners.length > 0) {
        transaction.partialSign(...partialSigners);
      }

      const txHash = await anchorProvider.sendAndConfirm(transaction);

      return { success: true, txHash, crunchName };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["coordinator-crunches"] });
      toast({
        title: "Crunch started successfully",
        description: `"${result.crunchName}" is now active.`,
      });
    },
    onError: (error) => {
      console.error("Start crunch error:", error);
      toast({
        title: "Failed to start crunch",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  return {
    startCrunch: mutation.mutate,
    startCrunchAsync: mutation.mutateAsync,
    startCrunchLoading: mutation.isPending,
    startCrunchError: mutation.error,
  };
};
