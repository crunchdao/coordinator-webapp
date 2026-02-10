"use client";
import { useQuery } from "@tanstack/react-query";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { getLeaderboard } from "../../infrastructure/services";

export function useGetLeaderboard() {
  const { crunchName } = useCrunchContext();

  const query = useQuery({
    queryKey: ["leaderboard", crunchName],
    queryFn: () => getLeaderboard(crunchName),
    enabled: !!crunchName,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    leaderboard: query.data || [],
    leaderboardLoading: query.isLoading || query.isFetching,
  };
}
