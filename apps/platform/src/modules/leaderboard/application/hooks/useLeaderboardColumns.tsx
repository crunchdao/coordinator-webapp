"use client";
import { useQuery } from "@tanstack/react-query";
import { getLeaderboardColumns } from "../../infrastructure/services";

export const useLeaderboardColumns = (slug: string) => {
  const query = useQuery({
    queryKey: ["leaderboardColumns", slug],
    queryFn: () => getLeaderboardColumns(slug),
    enabled: !!slug,
  });

  return {
    columns: query.data || [],
    columnsLoading: query.isLoading,
  };
};
