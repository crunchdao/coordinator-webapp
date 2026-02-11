"use client";

import { useQuery } from "@tanstack/react-query";
import { getCheckpoints } from "../../infrastructure/service";
import { GetCheckpointsParams } from "../../domain/types";

export function useGetCheckpoints(params?: GetCheckpointsParams) {
  const query = useQuery({
    queryKey: ["checkpoints", params],
    queryFn: () => getCheckpoints(params),
    enabled: !params?.crunchNames || params.crunchNames.length > 0,
  });

  return {
    checkpoints: query.data ?? [],
    checkpointsLoading: query.isLoading,
    checkpointsError: query.error,
  };
}
