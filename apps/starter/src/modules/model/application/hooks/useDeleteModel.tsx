import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteModel } from "../../infrastructure/services";
import { showApiErrorToast } from "@coordinator/utils/src/api";

export const useDeleteModel = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (modelId: string) => deleteModel(modelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
    },
    onError: (error) => {
      showApiErrorToast(error, "Failed to delete model");
    },
  });

  return {
    deleteModel: mutation.mutate,
    deleteModelLoading: mutation.isPending,
  };
};
