import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { UpdateCompetitionFormData } from "../schemas/updateCompetition";
import { updateCompetition } from "../../infrastructure/service";

export const useUpdateCompetition = (
  competitionIdentifier: string,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateCompetitionFormData) =>
      updateCompetition(competitionIdentifier, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["competition"],
      });
      toast({
        title: "Competition updated",
        description: "The competition has been updated successfully.",
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("Competition update error:", error);
      toast({
        title: "Failed to update competition",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  return {
    updateCompetition: mutation.mutate,
    updateCompetitionAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    updateError: mutation.error,
  };
};
