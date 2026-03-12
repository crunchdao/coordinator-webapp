"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addLocalMetricWidget } from "../../infrastructure/services";
import { Widget } from "@coordinator/metrics/src/domain/types";
import { showApiErrorToast } from "@/utils/api/apiClient";

export const useAddLocalWidget = (slug: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (widget: Omit<Widget, "id">) =>
      addLocalMetricWidget(slug, widget),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["widgets", slug] });
    },
    onError: (error) => {
      showApiErrorToast(error, "Failed to add widget");
    },
  });

  return {
    addWidget: mutation.mutate,
    addWidgetAsync: mutation.mutateAsync,
    addWidgetLoading: mutation.isPending,
  };
};
