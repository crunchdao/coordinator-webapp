"use client";
import { useQuery } from "@tanstack/react-query";
import { getLocalMetricsConfig } from "../../infrastructure/services";

export function useGetLocalWidgets(slug: string) {
  const query = useQuery({
    queryKey: ["widgets", slug],
    queryFn: () => getLocalMetricsConfig(slug),
    enabled: !!slug,
  });
  return {
    widgets: query.data?.widgets?.sort((a, b) => a.order - b.order),
    widgetsLoading: query.isLoading || query.isFetching,
  };
}
