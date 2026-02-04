import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import {
  getCoordinatorProgram,
  CrunchServiceWithContext,
} from "@crunchdao/sdk";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import { useTransactionExecutor } from "@/modules/wallet/application/hooks/useTransactionExecutor";
import { useMultisigProposalTracker } from "@/modules/wallet/application/context/multisigProposalTrackerContext";

interface StartCrunchParams {
  crunchName: string;
}

export const useStartCrunch = () => {
  const queryClient = useQueryClient();
  const { anchorProvider } = useAnchorProvider();
  const { executeTransaction, authority, isMultisigMode } =
    useTransactionExecutor();
  const { trackProposal } = useMultisigProposalTracker();

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
          title: "Crunch started successfully",
          description: `"${result.crunchName}" is now active.`,
        });
      };

      if (result.isMultisig && result.transactionIndex && result.multisigPda) {
        trackProposal({
          multisigPda: result.multisigPda,
          transactionIndex: result.transactionIndex,
          memo: `Start crunch: ${result.crunchName}`,
          proposalUrl: result.proposalUrl,
          signature: result.txHash,
          onExecuted: handleSuccess,
        });
      } else {
        handleSuccess();
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
