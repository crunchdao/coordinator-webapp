import { useMutation } from "@tanstack/react-query";
import { RegistrationFormData } from "../../domain/types";

export const useRegisterCoordinator = () => {
  const mutation = useMutation({
    mutationFn: async (data: RegistrationFormData) => {
      // TODO: Unmock
      console.log("Registering coordinator with data:", data);
      alert(`Mock: Registering coordinator "${data.organizationName}"`);
      return { success: true };
    },
  });

  return {
    registerCoordinator: mutation.mutate,
    registerCoordinatorLoading: mutation.isPending,
    registerCoordinatorError: mutation.error,
  };
};