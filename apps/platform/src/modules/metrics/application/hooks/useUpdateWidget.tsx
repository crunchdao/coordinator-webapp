"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWidget } from "../../infrastructure/services";
import { toast } from "@crunch-ui/core";
import { Widget } from "@coordinator/metrics/src/domain/types";

export const useUpdateWidget = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      id,
      widget,
    }: {
      id: number;
      widget: Omit<Widget, "id">;
    }) => updateWidget(id, widget),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["widgets"] });
      toast({ title: "Widget updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update widget", variant: "destructive" });
    },
  });

  return {
    updateWidget: mutation.mutate,
    updateWidgetAsync: mutation.mutateAsync,
    updateWidgetLoading: mutation.isPending,
  };
};
