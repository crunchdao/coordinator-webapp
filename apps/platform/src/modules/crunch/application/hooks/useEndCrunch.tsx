import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import {
  getCoordinatorProgram,
  CrunchServiceWithContext,
} from "@crunchdao/sdk";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import { useTransactionExecutor } from "@/modules/wallet/application/hooks/useTransactionExecutor";
import { useMultisigProposalTracker } from "@crunchdao/solana-utils";

interface EndCrunchParams {
  crunchName: string;
}

export const useEndCrunch = () => {
  const queryClient = useQueryClient();
  const { anchorProvider } = useAnchorProvider();
  const { executeTransaction, authority, isMultisigMode } =
    useTransactionExecutor();
  const { trackProposal } = useMultisigProposalTracker();

  const mutation = useMutation({
    mutationFn: async ({ crunchName }: EndCrunchParams) => {
      if (!anchorProvider || !authority) {
        throw new Error("Wallet not connected");
      }

      const coordinatorProgram = getCoordinatorProgram(anchorProvider);
      const crunchService = CrunchServiceWithContext({
        program: coordinatorProgram,
      });

      const instructions = await crunchService.endCrunchInstructions(
        crunchName,
        authority
      );

      const result = await executeTransaction({
        instructions,
        memo: `End crunch: ${crunchName}`,
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
          title: "Crunch ended",
          description: `"${result.crunchName}" has been stopped and margin paid out.`,
        });
      };

      if (result.isMultisig && result.transactionIndex && result.multisigPda) {
        trackProposal({
          multisigPda: result.multisigPda,
          transactionIndex: result.transactionIndex,
          memo: `End crunch: ${result.crunchName}`,
          proposalUrl: result.proposalUrl,
          signature: result.txHash,
          onExecuted: handleSuccess,
        });
      } else {
        handleSuccess();
      }
    },
    onError: (error) => {
      console.error("End crunch error:", error);
      toast({
        title: "Failed to end crunch",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  return {
    endCrunch: mutation.mutate,
    endCrunchLoading: mutation.isPending,
    isMultisigMode,
  };
};
