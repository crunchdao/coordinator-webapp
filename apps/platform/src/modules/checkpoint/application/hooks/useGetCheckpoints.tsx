"use client";

import { useQuery } from "@tanstack/react-query";
import { getCheckpoints } from "../../infrastructure/service";
import { GetCheckpointsParams } from "../../domain/types";
import { useEnvironment } from "@/modules/environment/application/context/environmentContext";

export function useGetCheckpoints(params?: GetCheckpointsParams) {
  const { environment } = useEnvironment();

  const query = useQuery({
    queryKey: ["checkpoints", environment, params],
    queryFn: () => getCheckpoints(params),
    enabled: !params?.crunchNames || params.crunchNames.length > 0,
  });

  return {
    checkpoints: query.data ?? [],
    checkpointsLoading: query.isLoading,
    checkpointsError: query.error,
  };
}
