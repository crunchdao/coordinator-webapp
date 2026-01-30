"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addLeaderboardColumn } from "../../infrastructure/services";
import { LeaderboardColumn } from "@coordinator/leaderboard/src/domain/types";

export const useAddColumn = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (column: Omit<LeaderboardColumn, "id">) =>
      addLeaderboardColumn(column),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaderboardColumns"] });
    },
  });

  return {
    addColumn: mutation.mutate,
    addColumnAsync: mutation.mutateAsync,
    addColumnLoading: mutation.isPending,
  };
};
