import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addModel } from "../../infrastructure/services";
import { AddModelBody } from "../../domain/types";
import { showApiErrorToast } from "@coordinator/utils/src/api";

export const useAddModel = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: AddModelBody) => addModel(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["models"] });
    },
    onError: (error) => {
      showApiErrorToast(error, "Failed to add model");
    },
  });

  return {
    addModel: mutation.mutate,
    addModelLoading: mutation.isPending,
  };
};
