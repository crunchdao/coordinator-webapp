"use client";
import { useQuery } from "@tanstack/react-query";
import { getLocalLeaderboardConfig } from "../../infrastructure/services";

export const useLocalLeaderboardColumns = (slug: string) => {
  const query = useQuery({
    queryKey: ["leaderboardColumns", slug],
    queryFn: () => getLocalLeaderboardConfig(slug),
    enabled: !!slug,
  });

  return {
    columns: query.data?.columns || [],
    externalUrl: query.data?.externalUrl ?? null,
    columnsLoading: query.isLoading,
  };
};
