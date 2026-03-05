"use client";
import { useQuery } from "@tanstack/react-query";
import { getLocalMetricsWidgets } from "../../infrastructure/services";

export function useGetLocalWidgets(slug: string) {
  const query = useQuery({
    queryKey: ["widgets", slug],
    queryFn: () => getLocalMetricsWidgets(slug),
    enabled: !!slug,
  });
  return {
    widgets: query.data?.sort((a, b) => a.order - b.order),
    widgetsLoading: query.isLoading || query.isFetching,
  };
}
