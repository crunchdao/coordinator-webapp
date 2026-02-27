import { useQuery } from "@tanstack/react-query";
import { getSeason } from "../../infrastructure/service";

export const useGetSeason = (seasonNumber: number | string) => {
  const query = useQuery({
    queryKey: ["seasons", seasonNumber],
    queryFn: () => getSeason(seasonNumber),
    enabled: !!seasonNumber,
    retry: 1,
  });

  return {
    season: query.data,
    seasonLoading: query.isLoading || query.isFetching,
  };
};
