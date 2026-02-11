"use client";

import { useQuery } from "@tanstack/react-query";
import { getCrunch } from "../../infrastructure/service";

export function useGetCrunch(address?: string) {
  const query = useQuery({
    queryKey: ["crunch", address],
    queryFn: () => getCrunch(address!),
    enabled: !!address,
  });

  return {
    crunch: query.data ?? null,
    crunchLoading: query.isLoading,
    crunchError: query.error,
  };
}
