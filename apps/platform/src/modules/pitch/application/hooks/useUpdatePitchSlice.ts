import { useMutation } from "@tanstack/react-query";
import { Locale, UpdatePitchSliceBody } from "../../domain/types";
import { updatePitchSlice } from "../../infrastructure/service";

export const useUpdatePitchSlice = (
  seasonNumber: number,
  crunchAddress: string,
  locale?: Locale
) => {
  const mutation = useMutation({
    mutationFn: ({
      sliceName,
      body,
    }: {
      sliceName: string;
      body: UpdatePitchSliceBody;
      locale?: Locale;
    }) => updatePitchSlice(seasonNumber, crunchAddress, sliceName, body, locale),
  });

  return {
    updateSlice: mutation.mutate,
    updateSliceAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
};
