"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeMetricsWidget } from "../../infrastructure/services";

export const useRemoveWidget = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => removeMetricsWidget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["widgets"] });
    },
  });

  return {
    removeWidget: mutation.mutate,
    removeWidgetAsync: mutation.mutateAsync,
    removeWidgetLoading: mutation.isPending,
  };
};
