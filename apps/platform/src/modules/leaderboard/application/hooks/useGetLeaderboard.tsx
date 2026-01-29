"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getLeaderboard } from "../../infrastructure/services";

export function useGetLeaderboard() {
  const params = useParams();
  const crunchName = params.crunchname as string;

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
