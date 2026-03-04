import { useQuery } from "@tanstack/react-query";
import { Locale } from "../../domain/types";
import { getPitchSlices } from "../../infrastructure/service";

export const useGetPitchSlices = (
  seasonNumber: number | undefined,
  crunchAddress: string | undefined,
  locale?: Locale
) => {
  const query = useQuery({
    queryKey: ["pitchSlices", seasonNumber, crunchAddress, locale],
    queryFn: () =>
      getPitchSlices(seasonNumber as number, crunchAddress as string, locale),
    enabled: !!seasonNumber && !!crunchAddress,
    select: (data) => [...data].sort((a, b) => a.order - b.order),
  });

  return {
    slices: query.data,
    slicesLoading: query.isLoading,
  };
};
