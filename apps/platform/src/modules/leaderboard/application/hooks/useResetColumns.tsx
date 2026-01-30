"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resetLeaderboardColumns } from "../../infrastructure/services";
import { toast } from "@crunch-ui/core";

export const useResetColumns = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: resetLeaderboardColumns,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaderboardColumns"] });
      toast({ title: "Columns reset to default successfully" });
    },
    onError: () => {
      toast({ title: "Failed to reset columns", variant: "destructive" });
    },
  });

  return {
    resetColumns: mutation.mutate,
    resetColumnsAsync: mutation.mutateAsync,
    resetColumnsLoading: mutation.isPending,
  };
};
