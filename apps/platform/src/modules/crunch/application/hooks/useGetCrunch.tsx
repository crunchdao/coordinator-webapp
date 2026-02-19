"use client";

import { useQuery } from "@tanstack/react-query";
import { getCrunch } from "../../infrastructure/service";
import { useEnvironment } from "@/modules/environment/application/context/environmentContext";

export function useGetCrunch(address?: string) {
  const { environment } = useEnvironment();

  const query = useQuery({
    queryKey: ["crunch", environment, address],
    queryFn: () => getCrunch(address!),
    enabled: !!address,
  });

  return {
    crunch: query.data ?? null,
    crunchLoading: query.isLoading,
    crunchError: query.error,
  };
}
