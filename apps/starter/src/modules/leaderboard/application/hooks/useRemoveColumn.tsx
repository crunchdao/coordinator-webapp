"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeLeaderboardColumn } from "../../infrastructure/services";
import { showApiErrorToast } from "@/utils/api/apiClient";

export const useRemoveColumn = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => removeLeaderboardColumn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaderboardColumns"] });
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
