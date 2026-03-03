"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeLeaderboardColumn } from "../../infrastructure/services";
import { showApiErrorToast } from "@coordinator/utils/src/api";

export const useRemoveColumn = (slug: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => removeLeaderboardColumn(slug, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["leaderboardColumns", slug],
      });
    },
    onError: (error) => {
      showApiErrorToast(error, "Failed to remove column");
    },
  });

  return {
    removeColumn: mutation.mutate,
    removeColumnAsync: mutation.mutateAsync,
    removeColumnLoading: mutation.isPending,
  };
};
