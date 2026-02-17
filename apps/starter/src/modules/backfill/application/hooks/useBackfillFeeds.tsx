"use client";

import { useQuery } from "@tanstack/react-query";
import { getBackfillFeeds } from "../../infrastructure/services";

export function useBackfillFeeds() {
  const query = useQuery({
    queryKey: ["backfill-feeds"],
    queryFn: getBackfillFeeds,
    retry: false,
  });

  return {
    feeds: query.data ?? [],
    feedsLoading: query.isLoading,
  };
}
