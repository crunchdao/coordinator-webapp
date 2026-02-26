import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { Locale, CreateOverviewSliceBody } from "../../domain/types";
import { createOverviewSlice } from "../../infrastructure/service";

export const useCreateOverviewSlice = (
  crunchAddress: string,
  locale?: Locale
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateOverviewSliceBody) =>
      createOverviewSlice(crunchAddress, data, locale),
    onSuccess: () => {
      toast({
        title: "Slice created successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["overviewSlices", crunchAddress],
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create slice",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  return {
    createSlice: mutation.mutate,
    createSliceAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
  };
};
