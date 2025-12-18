"use client";
import { useQuery } from "@tanstack/react-query";
import { getModels } from "../../infrastructure/services";

export function useGetModels() {
  const query = useQuery({
    queryKey: ["models"],
    queryFn: getModels,
    refetchInterval: 7_500,
  });
  return {
    models: query.data,
    modelsLoading: query.isLoading || query.isFetching,
  };
}
