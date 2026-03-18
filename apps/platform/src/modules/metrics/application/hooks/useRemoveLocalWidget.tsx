"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeLocalMetricsWidget } from "../../infrastructure/services";
import { showApiErrorToast } from "@/utils/api/apiClient";

export const useRemoveLocalWidget = (slug: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => removeLocalMetricsWidget(slug, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["widgets", slug] });
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
