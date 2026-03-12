"use client";

import { useQuery } from "@tanstack/react-query";
import { proxyGet } from "@/utils/api/proxyApiClient";
import { NodeCheckpoint, NodeCheckpointStatus } from "../../domain/nodeTypes";

export function useGetNodeCheckpoints(
  coordinatorNodeUrl?: string,
  status?: NodeCheckpointStatus
) {
  const url = coordinatorNodeUrl
    ? `${coordinatorNodeUrl}/reports/checkpoints${status ? `?status=${status}` : ""}`
    : undefined;

  const query = useQuery({
    queryKey: ["node-checkpoints", coordinatorNodeUrl, status],
    queryFn: () => proxyGet<NodeCheckpoint[]>(url!),
    enabled: !!url,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    nodeCheckpoints: query.data ?? [],
    nodeCheckpointsLoading: query.isLoading,
  };
}
