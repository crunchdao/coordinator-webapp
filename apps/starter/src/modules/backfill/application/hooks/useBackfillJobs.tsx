"use client";

import { useQuery } from "@tanstack/react-query";
import { getBackfillJobs } from "../../infrastructure/services";

export function useBackfillJobs() {
  const query = useQuery({
    queryKey: ["backfill-jobs"],
    queryFn: () => getBackfillJobs(),
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
