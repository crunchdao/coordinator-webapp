import { useQuery } from "@tanstack/react-query";
import { getCompetition } from "../../infrastructure/service";

export const useGetCompetition = (crunchAddress: string | undefined) => {
  const query = useQuery({
    queryKey: ["competition", crunchAddress],
    queryFn: () => getCompetition(crunchAddress as string),
    enabled: !!crunchAddress,
  });

  return {
    competition: query.data,
    competitionLoading: query.isLoading,
  };
};
