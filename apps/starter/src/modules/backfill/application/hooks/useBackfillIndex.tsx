"use client";

import { useQuery } from "@tanstack/react-query";
import { getBackfillIndex } from "../../infrastructure/services";

export function useBackfillIndex() {
  const query = useQuery({
    queryKey: ["backfill-index"],
    queryFn: getBackfillIndex,
    retry: false,
    refetchInterval: 30_000,
  });

  return {
    files: query.data ?? [],
    filesLoading: query.isLoading,
  };
}
