import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { Widget } from "../../domain/types";
import { updateWidget } from "../../infrastructure/services";

export const useUpdateWidget = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, column }: { id: number; column: Omit<Widget, "id"> }) =>
      updateWidget(id, column),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["widgets"] });
      toast({ title: "Metric Widgets updated successfully" });
    },
    onError: () => {
      toast({
        title: "Failed to update Metric Widgets",
        variant: "destructive",
      });
    },
  });

  return {
    updateWidgets: mutation.mutate,
    updateWidgetsLoading: mutation.isPending,
  };
};
