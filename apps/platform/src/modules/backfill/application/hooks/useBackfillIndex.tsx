"use client";

import { useQuery } from "@tanstack/react-query";
import { useNodeConnection } from "@/modules/node/application/context/nodeConnectionContext";
import { getBackfillIndex } from "../../infrastructure/services";

export function useBackfillIndex() {
  const { nodeUrl } = useNodeConnection();

  const query = useQuery({
    queryKey: ["backfill-index", nodeUrl],
    queryFn: () => getBackfillIndex(nodeUrl),
    retry: false,
    refetchInterval: 30_000,
  });

  return {
    files: query.data ?? [],
    filesLoading: query.isLoading,
    nodeUrl,
  };
}
