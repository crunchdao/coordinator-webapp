import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { CreateCrunchFormData } from "../schemas/crunchCreation";
import {
  getCoordinatorProgram,
  CrunchServiceWithContext,
} from "@crunchdao/sdk";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import { useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { generateLink } from "@crunch-ui/utils";
import { INTERNAL_LINKS } from "@/utils/routes";
import { useRouter } from "next/navigation";

export const useCreateCrunch = () => {
  const queryClient = useQueryClient();
  const provider = useAnchorProvider();
  const { publicKey } = useWallet();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: CreateCrunchFormData) => {
      if (!provider || !publicKey) {
        throw new Error("Wallet not connected");
      }

      const coordinatorProgram = getCoordinatorProgram(provider);
      const crunchService = CrunchServiceWithContext({
        program: coordinatorProgram,
      });

      const instruction = await crunchService.createCrunchInstruction(
        {
          name: data.name,
          payoutAmount: data.payoutAmount,
          maxModelsPerCruncher: data.maxModelsPerCruncher,
        },
        publicKey
      );

      const transaction = new Transaction();
      transaction.add(instruction);

      // Get fresh blockhash
      const { blockhash } = await provider.connection.getLatestBlockhash(
        "confirmed"
      );
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send using the provider's sendAndConfirm
      const txHash = await provider.sendAndConfirm(transaction);

      return { success: true, txHash, crunchName: data.name };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["coordinator-crunches"] });
      toast({
        title: "Crunch created successfully",
        description: `Your crunch "${result.crunchName}" has been created.`,
      });
      router.push(
        generateLink(INTERNAL_LINKS.LEADERBOARD, {
          crunchname: result.crunchName,
        })
      );
    },
    onError: (error) => {
      console.error("Crunch creation error:", error);
      toast({
        title: "Failed to create crunch",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  return {
    createCrunch: mutation.mutate,
    createCrunchLoading: mutation.isPending,
    createCrunchError: mutation.error,
    createCrunchData: mutation.data,
  };
};
