"use client";

import { useQuery } from "@tanstack/react-query";
import { getCrunches } from "../../infrastructure/service";
import { GetCrunchesParams } from "../../domain/types";

export function useGetCrunches(params?: GetCrunchesParams) {
  const query = useQuery({
    queryKey: ["cpi-crunches", params],
    queryFn: () => getCrunches(params),
  });

  return {
    crunches: query.data ?? [],
    crunchesLoading: query.isLoading,
    crunchesError: query.error,
  };
}
