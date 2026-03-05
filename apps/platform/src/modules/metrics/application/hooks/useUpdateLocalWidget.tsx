"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLocalWidget } from "../../infrastructure/services";
import { toast } from "@crunch-ui/core";
import { Widget } from "@coordinator/metrics/src/domain/types";

export const useUpdateLocalWidget = (slug: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, widget }: { id: number; widget: Omit<Widget, "id"> }) =>
      updateLocalWidget(slug, id, widget),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["widgets", slug] });
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
