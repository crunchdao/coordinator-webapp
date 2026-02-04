import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { RegistrationFormData } from "../../domain/types";
import {
  getCoordinatorProgram,
  registerCoordinatorInstruction,
} from "@crunchdao/sdk";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import { useTransactionExecutor } from "@/modules/wallet/application/hooks/useTransactionExecutor";
import { useMultisigProposalTracker } from "@/modules/wallet/application/context/multisigProposalTrackerContext";

export const useRegisterCoordinator = () => {
  const queryClient = useQueryClient();
  const { anchorProvider } = useAnchorProvider();
  const { executeTransaction, authority, isMultisigMode } =
    useTransactionExecutor();
  const { trackProposal } = useMultisigProposalTracker();

  const mutation = useMutation({
    mutationFn: async (data: RegistrationFormData) => {
      if (!anchorProvider || !authority) {
        throw new Error("Wallet not connected");
      }

      const coordinatorProgram = getCoordinatorProgram(anchorProvider);

      const instruction = await registerCoordinatorInstruction(
        coordinatorProgram,
        data.organizationName,
        authority
      );

      const result = await executeTransaction({
        instructions: [instruction],
        partialSigners: [],
        memo: `Register coordinator: ${data.organizationName}`,
      });

      return {
        success: true,
        txHash: result.signature,
        organizationName: data.organizationName,
        isMultisig: result.isMultisig,
        proposalUrl: result.proposalUrl,
        transactionIndex: result.transactionIndex,
        multisigPda: result.multisigPda,
      };
    },
    onSuccess: (result) => {
      const handleSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["coordinator"] });
        toast({
          title: "Registration submitted",
          description: "Your coordinator account is now pending validation.",
        });
      };

      if (result.isMultisig && result.transactionIndex && result.multisigPda) {
        trackProposal({
          multisigPda: result.multisigPda,
          transactionIndex: result.transactionIndex,
          memo: `Register coordinator: ${result.organizationName}`,
          proposalUrl: result.proposalUrl,
          signature: result.txHash,
          onExecuted: handleSuccess,
        });
      } else {
        handleSuccess();
      }
    },
    onError: (error) => {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  return {
    registerCoordinator: mutation.mutate,
    registerCoordinatorAsync: mutation.mutateAsync,
    registerCoordinatorLoading: mutation.isPending,
    registerCoordinatorError: mutation.error,
    isMultisigMode,
  };
};
