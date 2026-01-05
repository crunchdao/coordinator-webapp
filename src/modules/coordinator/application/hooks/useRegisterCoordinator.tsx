import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { RegistrationFormData } from "../../domain/types";

export const useRegisterCoordinator = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async (data: RegistrationFormData) => {
      // TODO: Unmock
      console.log("Registering coordinator with data:", data);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coordinator"] });
      toast({ 
        title: "Registration submitted",
        description: "Your coordinator account is now pending validation."
      });
    },
    onError: () => {
      toast({
        title: "Registration failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    },
  });

  return {
    registerCoordinator: mutation.mutate,
    registerCoordinatorLoading: mutation.isPending,
    registerCoordinatorError: mutation.error,
  };
};