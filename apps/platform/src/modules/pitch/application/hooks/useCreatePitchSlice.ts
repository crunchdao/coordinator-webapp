import { useMutation } from "@tanstack/react-query";
import { Locale, CreatePitchSliceBody } from "../../domain/types";
import { createPitchSlice } from "../../infrastructure/service";

export const useCreatePitchSlice = (
  seasonNumber: number,
  crunchAddress: string,
  locale?: Locale
) => {
  const mutation = useMutation({
    mutationFn: (data: CreatePitchSliceBody) =>
      createPitchSlice(seasonNumber, crunchAddress, data, locale),
  });

  return {
    createSlice: mutation.mutate,
    createSliceAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
  };
};
