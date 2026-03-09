"use client";
import { useQuery } from "@tanstack/react-query";
import { getLeaderboard } from "../../infrastructure/services";

export function useGetLeaderboard(coordinatorNodeUrl?: string) {
  const query = useQuery({
    queryKey: ["leaderboard", coordinatorNodeUrl],
    queryFn: () => getLeaderboard(coordinatorNodeUrl),
    enabled: !!coordinatorNodeUrl,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    leaderboard: query.data || [],
    leaderboardLoading: query.isLoading || query.isFetching,
  };
}
