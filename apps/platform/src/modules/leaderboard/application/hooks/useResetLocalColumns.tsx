"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resetLocalLeaderboardColumns } from "../../infrastructure/services";
import { toast } from "@crunch-ui/core";

export const useResetLocalColumns = (slug: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => resetLocalLeaderboardColumns(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["leaderboardColumns", slug],
      });
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
