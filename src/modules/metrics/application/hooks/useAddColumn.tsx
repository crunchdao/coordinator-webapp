import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addLeaderboardColumn } from "../../infrastructure/services";
import { LeaderboardColumn } from "../../domain/types";

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
    addColumnLoading: mutation.isPending,
  };
};
