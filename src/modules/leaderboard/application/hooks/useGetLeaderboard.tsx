"use client";
import { useQuery } from "@tanstack/react-query";
import { getLeaderboard } from "../../infrastructure/services";

export function useGetLeaderboard() {
  const query = useQuery({
    queryKey: ["leaderboard"],
    queryFn: getLeaderboard,
  });
  return {
    leaderboard: query.data,
    leaderboardLoading: query.isLoading || query.isFetching,
  };
}
