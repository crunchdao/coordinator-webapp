"use client";

import { useQuery } from "@tanstack/react-query";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import {
  getNodeHealth,
  getNodeModels,
  getNodeFeeds,
  getNodeSnapshots,
  NodeHealth,
  NodeModel,
  NodeFeed,
  NodeSnapshot,
} from "../../infrastructure/nodeStatusService";
import { getNodeCheckpoints } from "@/modules/checkpoint/infrastructure/nodeService";
import { NodeCheckpoint } from "@/modules/checkpoint/domain/nodeTypes";

export interface NodeStatus {
  health: NodeHealth | null;
  models: NodeModel[];
  feeds: NodeFeed[];
  snapshots: NodeSnapshot[];
  recentCheckpoints: NodeCheckpoint[];
  isOnline: boolean;
}

export function useNodeStatus() {
  const { crunchName } = useCrunchContext();

  const healthQuery = useQuery({
    queryKey: ["node-health", crunchName],
    queryFn: () => getNodeHealth(crunchName),
    enabled: !!crunchName,
    retry: false,
    refetchInterval: 15_000,
  });

  const modelsQuery = useQuery({
    queryKey: ["node-models", crunchName],
    queryFn: () => getNodeModels(crunchName),
    enabled: !!crunchName,
    retry: false,
    refetchInterval: 30_000,
  });

  const feedsQuery = useQuery({
    queryKey: ["node-feeds", crunchName],
    queryFn: () => getNodeFeeds(crunchName),
    enabled: !!crunchName,
    retry: false,
    refetchInterval: 15_000,
  });

  const snapshotsQuery = useQuery({
    queryKey: ["node-snapshots", crunchName],
    queryFn: () => getNodeSnapshots(crunchName, 5),
    enabled: !!crunchName,
    retry: false,
    refetchInterval: 30_000,
  });

  const checkpointsQuery = useQuery({
    queryKey: ["node-checkpoints-recent", crunchName],
    queryFn: () => getNodeCheckpoints(crunchName),
    enabled: !!crunchName,
    retry: false,
    refetchInterval: 30_000,
  });

  const isOnline = healthQuery.isSuccess && healthQuery.data?.status === "ok";

  return {
    nodeStatus: {
      health: healthQuery.data ?? null,
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
