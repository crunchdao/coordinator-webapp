"use client";

import { useQuery } from "@tanstack/react-query";
import { useNodeConnection } from "../context/nodeConnectionContext";
import {
  getNodeHealth,
  getNodeInfo,
  getNodeModels,
  getNodeFeeds,
  getNodeSnapshots,
  getNodeCheckpoints,
  NodeHealth,
  NodeInfo,
  NodeModel,
  NodeFeed,
  NodeSnapshot,
} from "../../infrastructure/nodeService";
import { NodeCheckpoint } from "@/modules/checkpoint/domain/nodeTypes";

export interface NodeStatus {
  health: NodeHealth | null;
  info: NodeInfo | null;
  models: NodeModel[];
  feeds: NodeFeed[];
  snapshots: NodeSnapshot[];
  recentCheckpoints: NodeCheckpoint[];
  isOnline: boolean;
}

export function useNodeStatus() {
  const { nodeUrl } = useNodeConnection();

  const healthQuery = useQuery({
    queryKey: ["node-health", nodeUrl],
    queryFn: () => getNodeHealth(nodeUrl),
    retry: false,
    refetchInterval: 15_000,
  });

  const infoQuery = useQuery({
    queryKey: ["node-info", nodeUrl],
    queryFn: () => getNodeInfo(nodeUrl),
    retry: false,
    refetchInterval: 60_000,
  });

  const modelsQuery = useQuery({
    queryKey: ["node-models", nodeUrl],
    queryFn: () => getNodeModels(nodeUrl),
    retry: false,
    refetchInterval: 30_000,
  });

  const feedsQuery = useQuery({
    queryKey: ["node-feeds", nodeUrl],
    queryFn: () => getNodeFeeds(nodeUrl),
    retry: false,
    refetchInterval: 15_000,
  });

  const snapshotsQuery = useQuery({
    queryKey: ["node-snapshots", nodeUrl],
    queryFn: () => getNodeSnapshots(nodeUrl, 5),
    retry: false,
    refetchInterval: 30_000,
  });

  const checkpointsQuery = useQuery({
    queryKey: ["node-checkpoints-recent", nodeUrl],
    queryFn: () => getNodeCheckpoints(nodeUrl),
    retry: false,
    refetchInterval: 30_000,
  });

  const isOnline = healthQuery.isSuccess && healthQuery.data?.status === "ok";

  return {
    nodeStatus: {
      health: healthQuery.data ?? null,
      info: infoQuery.data ?? null,
      models: modelsQuery.data ?? [],
      feeds: feedsQuery.data ?? [],
      snapshots: snapshotsQuery.data ?? [],
      recentCheckpoints: checkpointsQuery.data ?? [],
      isOnline,
    } as NodeStatus,
    nodeStatusLoading:
      healthQuery.isLoading ||
      modelsQuery.isLoading ||
      feedsQuery.isLoading ||
      snapshotsQuery.isLoading,
    nodeStatusError: healthQuery.error,
  };
}
