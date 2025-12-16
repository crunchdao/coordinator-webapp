import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addModel } from "../../infrastructure/services";
import { AddModelBody } from "../../domain/types";

export const useAddModel = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: AddModelBody) => addModel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
    },
  });

  return {
    addModel: mutation.mutate,
    addModelLoading: mutation.isPending,
  };
};
