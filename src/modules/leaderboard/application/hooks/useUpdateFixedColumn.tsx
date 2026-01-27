import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFixedColumnProperty } from "../../infrastructure/services";
import { toast } from "@crunch-ui/core";

export const useUpdateFixedColumn = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, property }: { id: number; property: string }) =>
      updateFixedColumnProperty(id, property),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaderboardColumns"] });
      toast({ title: "Column updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update column", variant: "destructive" });
    },
  });

  return {
    updateFixedColumn: mutation.mutate,
    updateFixedColumnLoading: mutation.isPending,
  };
};
