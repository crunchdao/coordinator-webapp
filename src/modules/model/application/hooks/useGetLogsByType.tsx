"use client";
import { useQuery } from "@tanstack/react-query";
import { getJobLogsByType } from "../../infrastructure/services";
import { JobLogType } from "../../domain/types";

export function useGetLogsByType(type: JobLogType, jobId: string) {
  const query = useQuery({
    queryKey: ["modelLogs", type, jobId],
    queryFn: () => getJobLogsByType(jobId, type),
  });
  return {
    logs: query.data,
    logsLoading: query.isLoading || query.isFetching,
  };
}
