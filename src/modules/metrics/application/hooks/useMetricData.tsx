"use client";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/utils/api";
import { GetMetricDataParams } from "../../domain/types";

export const useMetricData = (
  endpointUrl: string,
  widgetId: number,
  params: GetMetricDataParams
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["metricData", widgetId, endpointUrl, params],
    queryFn: async () => {
      const response = await apiClient.get(endpointUrl, {
        params: {
          projectIds: params.modelIds.join(","),
          start: params.start,
          end: params.end,
        },
      });
      return response.data;
    },
    enabled: !!endpointUrl && !!params && !!params.modelIds.length,
  });

  return {
    data,
    isLoading,
    error,
  };
};
