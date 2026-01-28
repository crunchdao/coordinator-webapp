import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { RegistrationFormData } from "../../domain/types";
import { getCoordinatorProgram, registerCoordinator } from "@crunchdao/sdk";
import { useAnchorProvider } from "@coordinator/wallet/src/application/hooks/useAnchorProvider";

export const useRegisterCoordinator = () => {
  const queryClient = useQueryClient();
  const { anchorProvider } = useAnchorProvider();

  const mutation = useMutation({
    mutationFn: async (data: RegistrationFormData) => {
      if (!anchorProvider) {
        throw new Error("Wallet not connected");
      }

      const coordinatorProgram = getCoordinatorProgram(anchorProvider);
      const txHash = await registerCoordinator(
        coordinatorProgram,
        data.organizationName
      );

      if (!txHash) {
        throw new Error("Coordinator already exists");
      }

      return { success: true, txHash };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coordinator"] });
      toast({
        title: "Registration submitted",
        description: "Your coordinator account is now pending validation.",
      });
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: "Registration failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  return {
    registerCoordinator: mutation.mutate,
    registerCoordinatorLoading: mutation.isPending,
    registerCoordinatorError: mutation.error,
  };
};
