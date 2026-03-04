"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMetricWidget } from "../../infrastructure/services";
import { Widget } from "@coordinator/metrics/src/domain/types";
import { showApiErrorToast } from "@coordinator/utils/src/api";

export const useAddWidget = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (widget: Omit<Widget, "id">) => addMetricWidget(widget),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["widgets"] });
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
