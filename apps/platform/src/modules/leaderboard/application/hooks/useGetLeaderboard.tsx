"use client";
import { useQuery } from "@tanstack/react-query";
import { proxyGet } from "@/utils/api/proxyApiClient";
import type { Leaderboard } from "@coordinator/leaderboard/src/domain/types";

export function useGetLeaderboard(coordinatorNodeUrl?: string) {
  const query = useQuery({
    queryKey: ["leaderboard", coordinatorNodeUrl],
    queryFn: () =>
      proxyGet<Leaderboard>(`${coordinatorNodeUrl}/reports/leaderboard`),
    enabled: !!coordinatorNodeUrl,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    leaderboard: query.data || [],
    leaderboardLoading: query.isLoading || query.isFetching,
  };
}
