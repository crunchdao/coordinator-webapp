"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeLocalLeaderboardColumn } from "../../infrastructure/services";
import { showApiErrorToast } from "@/utils/api/apiClient";

export const useRemoveLocalColumn = (slug: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => removeLocalLeaderboardColumn(slug, id),
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
