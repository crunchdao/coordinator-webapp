import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { resetWidgets } from "../../infrastructure/services";

export const useResetWidgets = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: resetWidgets,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["widgets"] });
      toast({ title: "Metric widgets reset to default successfully" });
    },
    onError: () => {
      toast({
        title: "Failed to reset metric widgets",
        variant: "destructive",
      });
    },
  });

  return {
    resetWidgets: mutation.mutate,
    resetWidgetsLoading: mutation.isPending,
  };
};
