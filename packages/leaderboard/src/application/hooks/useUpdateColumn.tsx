import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLeaderboardColumn } from "../../infrastructure/services";
import { toast } from "@crunch-ui/core";
import { LeaderboardColumn } from "../../domain/types";

export const useUpdateColumn = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, column }: { id: number; column: Omit<LeaderboardColumn, "id"> }) =>
      updateLeaderboardColumn(id, column),
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
    updateColumnLoading: mutation.isPending,
  };
};
