import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMetricWidget } from "../../infrastructure/services";
import { Widget } from "../../domain/types";

export const useAddWidget = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (widget: Omit<Widget, "id">) => addMetricWidget(widget),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["widgets"] });
    },
  });
  return {
    addWidget: mutation.mutate,
    addWidgetLoading: mutation.isPending,
  };
};
