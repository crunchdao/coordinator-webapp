import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateModel } from "../../infrastructure/services";
import { UpdateModelBody } from "../../domain/types";

export const useUpdateModel = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ modelId, data }: { modelId: number; data: UpdateModelBody }) => 
      updateModel(modelId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
    },
  });

  return {
    updateModel: mutation.mutate,
    updateModelLoading: mutation.isPending,
  };
};