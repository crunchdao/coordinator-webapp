"use client";
import { useQuery } from "@tanstack/react-query";
import { getLeaderboard } from "../../infrastructure/services";

export function useGetLeaderboard(externalUrl?: string | null) {
  const query = useQuery({
    queryKey: ["leaderboard", externalUrl],
    queryFn: () => getLeaderboard(externalUrl!),
    enabled: !!externalUrl,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    leaderboard: query.data || [],
    leaderboardLoading: query.isLoading || query.isFetching,
  };
}
