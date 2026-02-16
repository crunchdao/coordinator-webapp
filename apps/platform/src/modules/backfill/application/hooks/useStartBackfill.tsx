"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNodeConnection } from "@/modules/node/application/context/nodeConnectionContext";
import { startBackfill } from "../../infrastructure/services";
import { StartBackfillRequest } from "../../domain/types";

export function useStartBackfill() {
  const { nodeUrl } = useNodeConnection();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (body: StartBackfillRequest) => startBackfill(nodeUrl, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backfill-jobs", nodeUrl] });
    },
  });

  return {
    startBackfill: mutation.mutate,
    startBackfillLoading: mutation.isPending,
    startBackfillError: mutation.error,
  };
}
