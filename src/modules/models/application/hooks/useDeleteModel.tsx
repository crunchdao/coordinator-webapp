import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteModel } from "../../infrastructure/services";

export const useDeleteModel = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (modelId: number) => deleteModel(modelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
    },
  });

  return {
    deleteModel: mutation.mutate,
    deleteModelLoading: mutation.isPending,
  };
};
