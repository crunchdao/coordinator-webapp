"use client";

import { useQuery } from "@tanstack/react-query";
import { FeedTailFilters, getFeedsTail } from "../../infrastructure/services";

export function useGetFeedTail(
  filters: FeedTailFilters,
  enabled: boolean,
  refetchIntervalMs: number | false
) {
  const query = useQuery({
    queryKey: ["feeds-tail", filters],
    queryFn: () => getFeedsTail(filters),
    enabled,
    refetchInterval: refetchIntervalMs,
  });

  return {
    records: query.data || [],
    recordsLoading: query.isPending,
    recordsRefetching: query.isRefetching,
  };
}
