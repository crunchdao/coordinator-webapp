import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { CreateCrunchFormData } from "../schemas/crunchCreation";
import {
  getCoordinatorProgram,
  CrunchServiceWithContext,
} from "@crunchdao/sdk";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import { useTransactionExecutor } from "@/modules/wallet/application/hooks/useTransactionExecutor";
import { generateLink } from "@crunch-ui/utils";
import { INTERNAL_LINKS } from "@/utils/routes";
import { useRouter } from "next/navigation";

export const useCreateCrunch = () => {
  const queryClient = useQueryClient();
  const { anchorProvider } = useAnchorProvider();
  const { executeTransaction, authority, isMultisigMode } = useTransactionExecutor();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: CreateCrunchFormData) => {
      if (!anchorProvider || !authority) {
        throw new Error("Wallet not connected");
      }

      const coordinatorProgram = getCoordinatorProgram(anchorProvider);
      const crunchService = CrunchServiceWithContext({
        program: coordinatorProgram,
      });

      const instruction = await crunchService.createCrunchInstruction(
        {
          name: data.name,
          payoutAmount: data.payoutAmount,
          maxModelsPerCruncher: data.maxModelsPerCruncher,
        },
        authority
      );

      const result = await executeTransaction({
        instructions: [instruction],
        partialSigners: [],
        memo: `Create crunch: ${data.name}`,
      });

      return {
        success: true,
        txHash: result.signature,
        crunchName: data.name,
        isMultisig: result.isMultisig,
        proposalUrl: result.proposalUrl,
      };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["coordinator-crunches"] });

      if (result.isMultisig) {
        toast({
          title: "Multisig proposal created",
          description: `Proposal to create "${result.crunchName}" has been submitted for approval.`,
        });
      } else {
        toast({
          title: "Crunch created successfully",
          description: `Your crunch "${result.crunchName}" has been created.`,
        });
        router.push(
          generateLink(INTERNAL_LINKS.LEADERBOARD, {
            crunchname: result.crunchName,
          })
        );
      }
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
    createCrunchAsync: mutation.mutateAsync,
    createCrunchLoading: mutation.isPending,
    createCrunchError: mutation.error,
    createCrunchData: mutation.data,
    isMultisigMode,
  };
};
