"use client";
import { useQuery } from "@tanstack/react-query";
import { getLeaderboardColumns } from "../../infrastructure/services";

export const useLeaderboardColumns = () => {
  const query = useQuery({
    queryKey: ["leaderboardColumns"],
    queryFn: getLeaderboardColumns,
  });

  return {
    columns: query.data || [],
    columnsLoading: query.isLoading,
  };
};
