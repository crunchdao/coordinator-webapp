"use client";

import { useQuery } from "@tanstack/react-query";
import { getModelStates } from "../../infrastructure/service";
import { GetModelStatesParams } from "../../domain/types";

export function useGetModelStates(params?: GetModelStatesParams) {
  const query = useQuery({
    queryKey: ["model-states", params],
    queryFn: () => getModelStates(params),
    enabled: !params?.crunchNames || params.crunchNames.length > 0,
  });

  return {
    modelStates: query.data ?? [],
    modelStatesLoading: query.isLoading,
    modelStatesError: query.error,
  };
}
