"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeLeaderboardColumn } from "../../infrastructure/services";

export const useRemoveColumn = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => removeLeaderboardColumn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaderboardColumns"] });
    },
  });

  return {
    removeColumn: mutation.mutate,
    removeColumnAsync: mutation.mutateAsync,
    removeColumnLoading: mutation.isPending,
  };
};
