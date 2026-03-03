"use client";
import { useQuery } from "@tanstack/react-query";
import { getMetricsWidgets } from "../../infrastructure/services";

export function useGetWidgets(slug: string) {
  const query = useQuery({
    queryKey: ["widgets", slug],
    queryFn: () => getMetricsWidgets(slug),
    enabled: !!slug,
  });
  return {
    widgets: query.data?.sort((a, b) => a.order - b.order),
    widgetsLoading: query.isLoading || query.isFetching,
  };
}
