"use client";

import { useQuery } from "@tanstack/react-query";
import { useNodeConnection } from "../context/nodeConnectionContext";
import { getNodeFeedTail } from "../../infrastructure/feedService";
import { getNodeFeeds } from "../../infrastructure/nodeService";

export function useNodeFeeds() {
  const { nodeUrl } = useNodeConnection();

  const feedsQuery = useQuery({
    queryKey: ["node-feeds", nodeUrl],
    queryFn: () => getNodeFeeds(nodeUrl),
    retry: false,
    refetchInterval: 15_000,
  });

  return {
    feeds: feedsQuery.data ?? [],
    feedsLoading: feedsQuery.isLoading,
    feedsError: feedsQuery.error,
  };
}

export function useNodeFeedTail(params?: {
  source?: string;
  subject?: string;
  limit?: number;
}) {
  const { nodeUrl } = useNodeConnection();

  const query = useQuery({
    queryKey: ["node-feed-tail", nodeUrl, params],
    queryFn: () => getNodeFeedTail(nodeUrl, params),
    retry: false,
    refetchInterval: 5_000,
  });

  return {
    records: query.data ?? [],
    recordsLoading: query.isLoading,
    recordsError: query.error,
  };
}
