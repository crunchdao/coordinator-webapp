"use client";

import { useQuery } from "@tanstack/react-query";
import { getCrunches } from "../../infrastructure/service";
import { GetCrunchesParams } from "../../domain/types";
import { useEnvironment } from "@/modules/environment/application/context/environmentContext";

export function useGetCrunches(params?: GetCrunchesParams) {
  const { environment } = useEnvironment();

  const query = useQuery({
    queryKey: ["crunches", environment, params],
    queryFn: () => getCrunches(params),
    enabled: !!params,
  });

  return {
    crunches: query.data ?? [],
    crunchesLoading: query.isLoading,
    crunchesError: query.error,
  };
}
