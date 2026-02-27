import { useQuery } from "@tanstack/react-query";
import { getSeasons } from "../../infrastructure/service";

export const useGetSeasons = () => {
  const query = useQuery({
    queryKey: ["seasons"],
    queryFn: getSeasons,
    retry: 1,
  });

  return {
    seasons: query.data,
    seasonsLoading: query.isLoading || query.isFetching,
  };
};
