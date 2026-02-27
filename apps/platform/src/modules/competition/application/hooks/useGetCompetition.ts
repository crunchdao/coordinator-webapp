import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getCompetition } from "../../infrastructure/service";

export const useGetCompetition = (crunchAddress: string | undefined) => {
  const query = useQuery({
    queryKey: ["competition", crunchAddress],
    queryFn: () => getCompetition(crunchAddress as string),
    enabled: !!crunchAddress,
    retry: (failureCount, error) => {
      if ((error as AxiosError)?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });

  const isNotFound =
    query.isError && (query.error as AxiosError)?.response?.status === 404;

  return {
    competition: query.data,
    competitionLoading: query.isLoading,
    competitionExists: !isNotFound && !query.isError,
  };
};
