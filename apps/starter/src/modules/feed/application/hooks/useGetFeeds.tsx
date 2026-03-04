"use client";

import { useQuery } from "@tanstack/react-query";
import { getFeeds } from "../../infrastructure/services";

export function useGetFeeds(refetchIntervalMs: number | false = 10_000) {
  const query = useQuery({
    queryKey: ["feeds"],
    queryFn: getFeeds,
    refetchInterval: refetchIntervalMs,
  });

  return {
    feeds: query.data || [],
    feedsLoading: query.isPending,
    feedsRefetching: query.isRefetching,
  };
}
