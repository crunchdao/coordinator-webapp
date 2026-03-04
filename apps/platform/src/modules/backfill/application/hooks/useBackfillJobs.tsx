"use client";

import { useQuery } from "@tanstack/react-query";
import { useNodeConnection } from "@/modules/node/application/context/nodeConnectionContext";
import { getBackfillJobs } from "../../infrastructure/services";

export function useBackfillJobs() {
  const { nodeUrl } = useNodeConnection();

  const query = useQuery({
    queryKey: ["backfill-jobs", nodeUrl],
    queryFn: () => getBackfillJobs(nodeUrl),
    retry: false,
    refetchInterval: (query) => {
      const jobs = query.state.data;
      const hasRunning = jobs?.some((j) => j.status === "RUNNING");
      return hasRunning ? 5_000 : 30_000;
    },
  });

  return {
    jobs: query.data ?? [],
    jobsLoading: query.isLoading,
    hasRunningJob: (query.data ?? []).some((j) => j.status === "RUNNING"),
  };
}
