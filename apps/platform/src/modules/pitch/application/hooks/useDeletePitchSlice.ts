import { useMutation } from "@tanstack/react-query";
import { Locale } from "../../domain/types";
import { deletePitchSlice } from "../../infrastructure/service";

export const useDeletePitchSlice = (
  seasonNumber: number,
  crunchAddress: string,
  locale?: Locale
) => {
  const mutation = useMutation({
    mutationFn: (sliceName: string) =>
      deletePitchSlice(seasonNumber, crunchAddress, sliceName, locale),
  });

  return {
    deleteSlice: mutation.mutateAsync,
    isDeleting: mutation.isPending,
  };
};
