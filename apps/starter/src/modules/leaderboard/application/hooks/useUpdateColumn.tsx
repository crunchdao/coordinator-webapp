"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLeaderboardColumn } from "../../infrastructure/services";
import { toast } from "@crunch-ui/core";
import { LeaderboardColumn } from "@coordinator/leaderboard/src/domain/types";

export const useUpdateColumn = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      id,
      column,
    }: {
      id: number;
      column: Omit<LeaderboardColumn, "id">;
    }) => updateLeaderboardColumn(id, column),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaderboardColumns"] });
      toast({ title: "Column updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update column", variant: "destructive" });
    },
  });

  return {
    updateColumn: mutation.mutate,
    updateColumnAsync: mutation.mutateAsync,
    updateColumnLoading: mutation.isPending,
  };
};
