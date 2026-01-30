"use client";
import { useQuery } from "@tanstack/react-query";
import { getMetricsWidgets } from "../../infrastructure/services";

export function useGetWidgets() {
  const query = useQuery({
    queryKey: ["widgets"],
    queryFn: getMetricsWidgets,
  });
  return {
    widgets: query.data?.sort((a, b) => a.order - b.order),
    widgetsLoading: query.isLoading || query.isFetching,
  };
}
