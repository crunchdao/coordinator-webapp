"use client";

import { useQuery } from "@tanstack/react-query";
import { getFeeds } from "../../infrastructure/services";

export function useGetFeeds() {
  const query = useQuery({
    queryKey: ["feeds"],
    queryFn: getFeeds,
    refetchInterval: 10_000,
  });

  return {
    feeds: query.data || [],
    feedsLoading: query.isPending,
  };
}
