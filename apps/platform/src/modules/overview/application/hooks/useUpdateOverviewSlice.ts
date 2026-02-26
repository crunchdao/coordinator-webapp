import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { Locale, UpdateOverviewSliceBody } from "../../domain/types";
import { updateOverviewSlice } from "../../infrastructure/service";

export const useUpdateOverviewSlice = (
  crunchAddress: string,
  locale?: Locale
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      sliceName,
      body,
    }: {
      sliceName: string;
      body: UpdateOverviewSliceBody;
      locale?: Locale;
    }) => updateOverviewSlice(crunchAddress, sliceName, body, locale),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["overviewSlices", crunchAddress],
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update slice",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  return {
    updateSlice: mutation.mutate,
    updateSliceAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
};
