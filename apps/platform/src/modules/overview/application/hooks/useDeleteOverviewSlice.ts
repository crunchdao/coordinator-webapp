import { useMutation } from "@tanstack/react-query";
import { Locale } from "../../domain/types";
import { deleteOverviewSlice } from "../../infrastructure/service";

export const useDeleteOverviewSlice = (
  crunchAddress: string,
  locale?: Locale
) => {
  const mutation = useMutation({
    mutationFn: (sliceName: string) =>
      deleteOverviewSlice(crunchAddress, sliceName, locale),
  });

  return {
    deleteSlice: mutation.mutateAsync,
    isDeleting: mutation.isPending,
  };
};
