"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getLeaderboardColumns } from "../../infrastructure/services";

export const useLeaderboardColumns = () => {
  const params = useParams();
  const crunchName = params.crunchname as string;

  const query = useQuery({
    queryKey: ["leaderboardColumns", crunchName],
    queryFn: () => getLeaderboardColumns(crunchName),
    enabled: !!crunchName,
  });

  return {
    columns: query.data || [],
    columnsLoading: query.isLoading,
  };
};
