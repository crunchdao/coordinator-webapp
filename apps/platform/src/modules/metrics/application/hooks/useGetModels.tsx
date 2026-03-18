"use client";
import { useQuery } from "@tanstack/react-query";
import { proxyGet } from "@/utils/api/proxyApiClient";
import type { MetricsModelItem } from "../../domain/types";

export function useGetModels(coordinatorNodeUrl?: string) {
  const query = useQuery({
    queryKey: ["models", coordinatorNodeUrl],
    queryFn: () =>
      proxyGet<MetricsModelItem[]>(`${coordinatorNodeUrl}/reports/models`),
    enabled: !!coordinatorNodeUrl,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    models: query.data || [],
    modelsLoading: query.isLoading,
  };
}
