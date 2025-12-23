import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateModel } from "../../infrastructure/services";
import { UpdateModelBody, Model } from "../../domain/types";

export const useUpdateModel = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      modelId,
      data,
    }: {
      modelId: string;
      data: UpdateModelBody;
    }) => updateModel(modelId, data),
    onMutate: async ({ modelId, data }) => {
      await queryClient.cancelQueries({ queryKey: ["models"] });

      const previousModels = queryClient.getQueryData<Model[]>(["models"]);

      queryClient.setQueryData<Model[]>(["models"], (state) => {
        if (!state) return state;
        return state.map((model) =>
          model.id === modelId ? { ...model, ...data } : model
        );
      });

      return { previousModels };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousModels) {
        queryClient.setQueryData(["models"], context.previousModels);
      }
    },
  });

  return {
    updateModel: mutation.mutate,
    updateModelLoading: mutation.isPending,
  };
};
