"use client";

import { useQuery } from "@tanstack/react-query";
import { getStrategies } from "../../infrastructure/services";

export function useGetStrategies() {
  const query = useQuery({
    queryKey: ["strategies"],
    queryFn: getStrategies,
    retry: false,
    refetchInterval: 30_000,
  });

  return {
    strategies: query.data ?? [],
    strategiesLoading: query.isLoading,
    strategiesError: query.error,
  };
}
