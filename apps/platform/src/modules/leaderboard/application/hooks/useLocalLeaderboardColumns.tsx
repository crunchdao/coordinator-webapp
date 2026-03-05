"use client";
import { useQuery } from "@tanstack/react-query";
import { getLocalLeaderboardColumns } from "../../infrastructure/services";

export const useLocalLeaderboardColumns = (slug: string) => {
  const query = useQuery({
    queryKey: ["leaderboardColumns", slug],
    queryFn: () => getLocalLeaderboardColumns(slug),
    enabled: !!slug,
  });

  return {
    columns: query.data || [],
    columnsLoading: query.isLoading,
  };
};
