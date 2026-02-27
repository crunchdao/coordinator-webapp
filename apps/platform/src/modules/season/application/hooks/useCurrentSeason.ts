import { useQuery } from "@tanstack/react-query";
import { getSeasons } from "../../infrastructure/service";

export const useCurrentSeason = () => {
  const query = useQuery({
    queryKey: ["seasons"],
    queryFn: getSeasons,
    retry: 1,
    select: (response) => {
      if (!response.content.length) return undefined;
      return response.content.reduce((latest, season) =>
        season.number > latest.number ? season : latest
      );
    },
  });

  return {
    currentSeason: query.data,
    currentSeasonLoading: query.isLoading || query.isFetching,
  };
};
