import { useQuery } from "@tanstack/react-query";
import { Locale } from "../../domain/types";
import { getOverviewSlices } from "../../infrastructure/service";

export const useGetOverviewSlices = (
  crunchAddress: string | undefined,
  locale?: Locale
) => {
  const query = useQuery({
    queryKey: ["overviewSlices", crunchAddress, locale],
    queryFn: () => getOverviewSlices(crunchAddress as string, locale),
    enabled: !!crunchAddress,
    select: (data) => [...data].sort((a, b) => a.order - b.order),
  });

  return {
    slices: query.data,
    slicesLoading: query.isLoading,
  };
};
