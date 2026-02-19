"use client";

import { useQuery } from "@tanstack/react-query";
import { getModelStates } from "../../infrastructure/service";
import { GetModelStatesParams } from "../../domain/types";
import { useEnvironment } from "@/modules/environment/application/context/environmentContext";

export function useGetModelStates(params?: GetModelStatesParams) {
  const { environment } = useEnvironment();

  const query = useQuery({
    queryKey: ["model-states", environment, params],
    queryFn: () => getModelStates(params),
    enabled: !params?.crunchNames || params.crunchNames.length > 0,
  });

  return {
    modelStates: query.data ?? [],
    modelStatesLoading: query.isLoading,
    modelStatesError: query.error,
  };
}
