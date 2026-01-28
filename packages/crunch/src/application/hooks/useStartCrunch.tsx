import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import {
  getCoordinatorProgram,
  CrunchServiceWithContext,
} from "@crunchdao/sdk";
import { useAnchorProvider } from "@coordinator/wallet/src/application/hooks/useAnchorProvider";
import { useTransactionExecutor } from "@coordinator/wallet/src/application/hooks/useTransactionExecutor";

interface StartCrunchParams {
  crunchName: string;
}

export const useStartCrunch = () => {
  const queryClient = useQueryClient();
  const { anchorProvider } = useAnchorProvider();
  const { executeTransaction, authority, isMultisigMode } = useTransactionExecutor();

  const mutation = useMutation({
    mutationFn: async ({ crunchName }: StartCrunchParams) => {
      if (!anchorProvider || !authority) {
        throw new Error("Wallet not connected");
      }

      const coordinatorProgram = getCoordinatorProgram(anchorProvider);
      const crunchService = CrunchServiceWithContext({
        program: coordinatorProgram,
      });

      // Use authority (vault in multisig mode, wallet otherwise) as the signer
      const { instructions, partialSigners } =
        await crunchService.startCrunchInstruction(crunchName, authority);

      const result = await executeTransaction({
        instructions,
        partialSigners,
        memo: `Start crunch: ${crunchName}`,
      });

      return {
        success: true,
        txHash: result.signature,
        crunchName,
        isMultisig: result.isMultisig,
        proposalUrl: result.proposalUrl,
      };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["coordinator-crunches"] });

      if (result.isMultisig) {
        toast({
          title: "Multisig proposal created",
          description: `Proposal to start "${result.crunchName}" has been submitted for approval.`,
        });
      } else {
        toast({
          title: "Crunch started successfully",
          description: `"${result.crunchName}" is now active.`,
        });
      }
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
    isMultisigMode,
  };
};
