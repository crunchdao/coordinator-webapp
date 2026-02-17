"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startBackfill } from "../../infrastructure/services";
import { StartBackfillRequest } from "../../domain/types";

export function useStartBackfill() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (body: StartBackfillRequest) => startBackfill(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backfill-jobs"] });
    },
  });

  return {
    startBackfill: mutation.mutate,
    startBackfillLoading: mutation.isPending,
    startBackfillError: mutation.error,
  };
}
