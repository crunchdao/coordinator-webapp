"use client";

import { useQuery } from "@tanstack/react-query";
import { getCheckpoint } from "../../infrastructure/service";
import { useEnvironment } from "@/modules/environment/application/context/environmentContext";

export function useGetCheckpoint(address?: string) {
  const { environment } = useEnvironment();

  const query = useQuery({
    queryKey: ["checkpoint", environment, address],
    queryFn: () => getCheckpoint(address!),
    enabled: !!address,
  });

  return {
    checkpoint: query.data ?? null,
    checkpointLoading: query.isLoading,
    checkpointError: query.error,
  };
}
