import { useQuery } from "@tanstack/react-query";
import { Locale } from "../../domain/types";
import { getOverviewSlices } from "../../infrastructure/service";

export const useGetOverviewSlices = (
  crunchName: string | undefined,
  locale?: Locale
) => {
  const query = useQuery({
    queryKey: ["overviewSlices", crunchName, locale],
    queryFn: () => getOverviewSlices(crunchName as string, locale),
    enabled: !!crunchName,
    select: (data) => [...data].sort((a, b) => a.order - b.order),
  });

  return {
    slices: query.data,
    slicesLoading: query.isLoading,
  };
};
