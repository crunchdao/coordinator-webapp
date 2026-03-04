"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addLeaderboardColumn } from "../../infrastructure/services";
import { LeaderboardColumn } from "@coordinator/leaderboard/src/domain/types";
import { showApiErrorToast } from "@coordinator/utils/src/api";

export const useAddColumn = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (column: Omit<LeaderboardColumn, "id">) =>
      addLeaderboardColumn(column),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaderboardColumns"] });
    },
    onError: (error) => {
      showApiErrorToast(error, "Failed to add column");
    },
  });

  return {
    addColumn: mutation.mutate,
    addColumnAsync: mutation.mutateAsync,
    addColumnLoading: mutation.isPending,
  };
};
