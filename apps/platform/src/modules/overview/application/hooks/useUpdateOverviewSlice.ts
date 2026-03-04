import { useMutation } from "@tanstack/react-query";
import { Locale, UpdateOverviewSliceBody } from "../../domain/types";
import { updateOverviewSlice } from "../../infrastructure/service";

export const useUpdateOverviewSlice = (
  crunchAddress: string,
  locale?: Locale
) => {
  const mutation = useMutation({
    mutationFn: ({
      sliceName,
      body,
    }: {
      sliceName: string;
      body: UpdateOverviewSliceBody;
      locale?: Locale;
    }) => updateOverviewSlice(crunchAddress, sliceName, body, locale),
  });

  return {
    updateSlice: mutation.mutate,
    updateSliceAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
};
