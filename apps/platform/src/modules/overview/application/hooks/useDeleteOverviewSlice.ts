import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { Locale } from "../../domain/types";
import { deleteOverviewSlice } from "../../infrastructure/service";

export const useDeleteOverviewSlice = (
  crunchName: string,
  locale?: Locale
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (sliceName: string) =>
      deleteOverviewSlice(crunchName, sliceName, locale),
    onSuccess: () => {
      toast({
        title: "Slice deleted successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["overviewSlices", crunchName],
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete slice",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  return {
    deleteSlice: mutation.mutateAsync,
    isDeleting: mutation.isPending,
  };
};
