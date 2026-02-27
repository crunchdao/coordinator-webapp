import { useMutation } from "@tanstack/react-query";
import { Locale, CreateOverviewSliceBody } from "../../domain/types";
import { createOverviewSlice } from "../../infrastructure/service";

export const useCreateOverviewSlice = (
  crunchAddress: string,
  locale?: Locale
) => {
  const mutation = useMutation({
    mutationFn: (data: CreateOverviewSliceBody) =>
      createOverviewSlice(crunchAddress, data, locale),
  });

  return {
    createSlice: mutation.mutate,
    createSliceAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
  };
};
