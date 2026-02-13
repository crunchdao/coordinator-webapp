"use client";

import { useQuery } from "@tanstack/react-query";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import {
  getNodeFeedTail,
  FeedRecord,
} from "../../infrastructure/feedService";
import {
  getNodeFeeds,
  NodeFeed,
} from "../../infrastructure/nodeStatusService";

export function useNodeFeeds() {
  const { crunchName } = useCrunchContext();

  const feedsQuery = useQuery({
    queryKey: ["node-feeds", crunchName],
    queryFn: () => getNodeFeeds(crunchName),
    enabled: !!crunchName,
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
  const { crunchName } = useCrunchContext();

  const query = useQuery({
    queryKey: ["node-feed-tail", crunchName, params],
    queryFn: () => getNodeFeedTail(crunchName, params),
    enabled: !!crunchName,
    retry: false,
    refetchInterval: 5_000,
  });

  return {
    records: query.data ?? [],
    recordsLoading: query.isLoading,
    recordsError: query.error,
  };
}
