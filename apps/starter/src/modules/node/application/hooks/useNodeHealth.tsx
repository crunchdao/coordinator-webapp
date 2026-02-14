"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getNodeHealth,
  getNodeInfo,
  getNodeModelCount,
  getNodeFeedCount,
  getNodeCheckpointCount,
} from "../../infrastructure/services";
import { NodeHealth, NodeInfo } from "../../domain/types";

export interface NodeStatus {
  health: NodeHealth | null;
  info: NodeInfo | null;
  modelCount: number;
  feedCount: number;
  checkpointCount: number;
  isOnline: boolean;
}

export function useNodeHealth() {
  const healthQuery = useQuery({
    queryKey: ["node-health"],
    queryFn: getNodeHealth,
    retry: false,
    refetchInterval: 15_000,
  });

  const infoQuery = useQuery({
    queryKey: ["node-info"],
    queryFn: getNodeInfo,
    retry: false,
    refetchInterval: 60_000,
  });

  const modelCountQuery = useQuery({
    queryKey: ["node-model-count"],
    queryFn: getNodeModelCount,
    retry: false,
    refetchInterval: 30_000,
  });

  const feedCountQuery = useQuery({
    queryKey: ["node-feed-count"],
    queryFn: getNodeFeedCount,
    retry: false,
    refetchInterval: 30_000,
  });

  const checkpointCountQuery = useQuery({
    queryKey: ["node-checkpoint-count"],
    queryFn: getNodeCheckpointCount,
    retry: false,
    refetchInterval: 30_000,
  });

  const isOnline = healthQuery.isSuccess && healthQuery.data?.status === "ok";

  return {
    nodeStatus: {
      health: healthQuery.data ?? null,
      info: infoQuery.data ?? null,
      modelCount: modelCountQuery.data ?? 0,
      feedCount: feedCountQuery.data ?? 0,
      checkpointCount: checkpointCountQuery.data ?? 0,
      isOnline,
    } as NodeStatus,
    nodeStatusLoading: healthQuery.isLoading,
  };
}
