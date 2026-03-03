"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resetMetricsWidgets } from "../../infrastructure/services";
import { toast } from "@crunch-ui/core";

export const useResetWidgets = (slug: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => resetMetricsWidgets(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["widgets", slug] });
      toast({ title: "Widgets reset to default successfully" });
    },
    onError: () => {
      toast({ title: "Failed to reset widgets", variant: "destructive" });
    },
  });

  return {
    resetWidgets: mutation.mutate,
    resetWidgetsAsync: mutation.mutateAsync,
    resetWidgetsLoading: mutation.isPending,
  };
};
