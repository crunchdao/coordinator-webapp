import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { CreateCrunchFormData } from "../schemas/crunchCreation";
import {
  getCoordinatorProgram,
  CrunchServiceWithContext,
} from "@crunchdao/sdk";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import { useTransactionExecutor } from "@/modules/wallet/application/hooks/useTransactionExecutor";
import { useMultisigProposalTracker } from "@/modules/wallet/application/context/multisigProposalTrackerContext";
import { generateLink } from "@crunch-ui/utils";
import { INTERNAL_LINKS } from "@/utils/routes";
import { useRouter } from "next/navigation";

export const useCreateCrunch = () => {
  const queryClient = useQueryClient();
  const { anchorProvider } = useAnchorProvider();
  const { executeTransaction, authority, isMultisigMode } =
    useTransactionExecutor();
  const { trackProposal } = useMultisigProposalTracker();
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
        transactionIndex: result.transactionIndex,
        multisigPda: result.multisigPda,
      };
    },
    onSuccess: (result) => {
      const handleSuccess = () => {
        queryClient.invalidateQueries({
          queryKey: ["coordinator-crunches"],
        });
        toast({
          title: "Crunch created successfully",
          description: `Your crunch "${result.crunchName}" has been created.`,
        });
        router.push(
          generateLink(INTERNAL_LINKS.LEADERBOARD, {
            crunchname: result.crunchName,
          })
        );
      };

      if (result.isMultisig && result.transactionIndex && result.multisigPda) {
        trackProposal({
          multisigPda: result.multisigPda,
          transactionIndex: result.transactionIndex,
          memo: `Create crunch: ${result.crunchName}`,
          proposalUrl: result.proposalUrl,
          signature: result.txHash,
          onExecuted: handleSuccess,
        });
      } else {
        handleSuccess();
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
