"use client";

import { useQuery } from "@tanstack/react-query";
import { getModelStates } from "../../infrastructure/service";
import { GetModelStatesOptions } from "../../domain/types";

export function useGetModelStates(options?: GetModelStatesOptions) {
  const query = useQuery({
    queryKey: ["model-states", options],
    queryFn: () => getModelStates(options),
    enabled: !!options?.crunchNames && options.crunchNames.length > 0,
  });

  return {
    modelStates: query.data ?? [],
    modelStatesLoading: query.isLoading,
    modelStatesError: query.error,
  };
}
