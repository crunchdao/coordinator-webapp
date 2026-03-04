"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeMetricsWidget } from "../../infrastructure/services";
import { showApiErrorToast } from "@coordinator/utils/src/api";

export const useRemoveWidget = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => removeMetricsWidget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["widgets"] });
    },
    onError: (error) => {
      showApiErrorToast(error, "Failed to remove widget");
    },
  });

  return {
    removeWidget: mutation.mutate,
    removeWidgetAsync: mutation.mutateAsync,
    removeWidgetLoading: mutation.isPending,
  };
};
