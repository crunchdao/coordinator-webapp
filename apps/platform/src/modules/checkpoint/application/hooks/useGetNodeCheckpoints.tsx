"use client";

import { useQuery } from "@tanstack/react-query";
import { proxyGet } from "@/utils/api/proxyApiClient";
import { NodeCheckpoint } from "../../domain/nodeTypes";

export function useGetNodeCheckpoints(coordinatorNodeUrl?: string) {
  const query = useQuery({
    queryKey: ["node-checkpoints", coordinatorNodeUrl],
    queryFn: () =>
      proxyGet<NodeCheckpoint[]>(`${coordinatorNodeUrl}/reports/checkpoints`),
    enabled: !!coordinatorNodeUrl,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    nodeCheckpoints: query.data ?? [],
    nodeCheckpointsLoading: query.isLoading,
  };
}
