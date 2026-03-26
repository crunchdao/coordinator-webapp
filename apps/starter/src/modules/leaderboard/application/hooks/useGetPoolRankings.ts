"use client";
import { useQuery } from "@tanstack/react-query";
import { getPoolRankings } from "../../infrastructure/poolServices";

export function useGetPoolRankings() {
  const query = useQuery({
    queryKey: ["poolRankings"],
    queryFn: getPoolRankings,
    refetchOnWindowFocus: false,
  });

  return {
    data: query.data,
    loading: query.isLoading || query.isFetching,
    error: query.error,
  };
}
