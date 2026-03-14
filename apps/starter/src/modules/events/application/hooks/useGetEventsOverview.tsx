"use client";
import { useQuery } from "@tanstack/react-query";
import { getEventsOverview } from "../../infrastructure/services";

export function useGetEventsOverview(params?: {
  limit?: number;
  resolved_only?: boolean;
  pending_only?: boolean;
}) {
  const query = useQuery({
    queryKey: ["events-overview", params],
    queryFn: () => getEventsOverview(params),
    refetchInterval: 30_000, // poll every 30s
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    data: query.data,
    events: query.data?.events ?? [],
    total: query.data?.total ?? 0,
    resolvedCount: query.data?.resolved_count ?? 0,
    pendingCount: query.data?.pending_count ?? 0,
    loading: query.isLoading,
    refetching: query.isFetching && !query.isLoading,
  };
}
