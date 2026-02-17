"use client";

import { useQuery } from "@tanstack/react-query";
import { FeedTailFilters, getFeedsTail } from "../../infrastructure/services";

export function useGetFeedTail(filters?: FeedTailFilters) {
  const query = useQuery({
    queryKey: ["feeds-tail", filters],
    queryFn: () => getFeedsTail(filters ?? {}),
    enabled: !!filters,
    retry: false,
    refetchInterval: 5_000,
  });

  return {
    records: query.data || [],
    recordsLoading: query.isPending,
    recordsError: query.error,
  };
}
