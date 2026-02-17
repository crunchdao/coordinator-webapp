"use client";

import { useQuery } from "@tanstack/react-query";
import { useNodeConnection } from "@/modules/node/application/context/nodeConnectionContext";
import { getNodeCheckpoints } from "@/modules/node/infrastructure/nodeService";

/**
 * Fetch pending checkpoints from the coordinator node.
 */
export function useGetPendingNodeCheckpoints() {
  const { nodeUrl } = useNodeConnection();

  const query = useQuery({
    queryKey: ["node-checkpoints", nodeUrl, "PENDING"],
    queryFn: () => getNodeCheckpoints(nodeUrl, "PENDING"),
    retry: false,
    refetchInterval: 30_000,
  });

  return {
    pendingCheckpoints: query.data ?? [],
    pendingCheckpointsLoading: query.isLoading,
    pendingCheckpointsError: query.error,
  };
}
