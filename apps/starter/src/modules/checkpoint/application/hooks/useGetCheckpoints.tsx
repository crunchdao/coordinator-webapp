"use client";

import { useQuery } from "@tanstack/react-query";
import { getCheckpoints } from "../../infrastructure/services";

export function useGetCheckpoints(status?: string) {
  const query = useQuery({
    queryKey: ["checkpoints", status],
    queryFn: () => getCheckpoints(status),
    retry: false,
    refetchInterval: 30_000,
  });

  return {
    checkpoints: query.data ?? [],
    checkpointsLoading: query.isLoading,
    checkpointsError: query.error,
  };
}
