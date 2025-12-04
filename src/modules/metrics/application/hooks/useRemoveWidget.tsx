import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeWidget } from "../../infrastructure/services";

export const useRemoveWidget = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => removeWidget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["widgets"] });
    },
  });

  return {
    removeWidget: mutation.mutate,
    removeWidgetLoading: mutation.isPending,
  };
};
