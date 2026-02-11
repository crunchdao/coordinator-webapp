"use client";

import { useQuery } from "@tanstack/react-query";
import { getCheckpoint } from "../../infrastructure/service";

export function useGetCheckpoint(address?: string) {
  const query = useQuery({
    queryKey: ["checkpoint", address],
    queryFn: () => getCheckpoint(address!),
    enabled: !!address,
  });

  return {
    checkpoint: query.data ?? null,
    checkpointLoading: query.isLoading,
    checkpointError: query.error,
  };
}
