"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addLocalLeaderboardColumn } from "../../infrastructure/services";
import { LeaderboardColumn } from "@coordinator/leaderboard/src/domain/types";
import { showApiErrorToast } from "@coordinator/utils/src/api";

export const useAddLocalColumn = (slug: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (column: Omit<LeaderboardColumn, "id">) =>
      addLocalLeaderboardColumn(slug, column),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["leaderboardColumns", slug],
      });
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
