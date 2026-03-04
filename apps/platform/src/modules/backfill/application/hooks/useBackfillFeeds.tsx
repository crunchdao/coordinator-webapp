"use client";

import { useQuery } from "@tanstack/react-query";
import { useNodeConnection } from "@/modules/node/application/context/nodeConnectionContext";
import { getBackfillFeeds } from "../../infrastructure/services";

export function useBackfillFeeds() {
  const { nodeUrl } = useNodeConnection();

  const query = useQuery({
    queryKey: ["backfill-feeds", nodeUrl],
    queryFn: () => getBackfillFeeds(nodeUrl),
    retry: false,
  });

  return {
    feeds: query.data ?? [],
    feedsLoading: query.isLoading,
  };
}
