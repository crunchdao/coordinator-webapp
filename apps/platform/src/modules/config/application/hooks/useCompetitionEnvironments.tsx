"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { showApiErrorToast } from "@coordinator/utils/src/api";
import {
  getCompetitionEnvironments,
  saveCompetitionEnvironments,
} from "../../infrastructure/service";
import { CompetitionEnvironments } from "../../domain/types";

export function useCompetitionEnvironments(slug: string) {
  const query = useQuery({
    queryKey: ["competitionEnvironments", slug],
    queryFn: () => getCompetitionEnvironments(slug),
    enabled: !!slug,
    retry: false,
  });

  return {
    environments: query.data,
    environmentsLoading: query.isLoading,
    environmentsError: query.error,
  };
}

export function useSaveCompetitionEnvironments(slug: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CompetitionEnvironments) =>
      saveCompetitionEnvironments(slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["competitionEnvironments", slug],
      });
      toast({ title: "Environments saved successfully" });
    },
    onError: (error) => {
      showApiErrorToast(error, "Failed to save environments");
    },
  });

  return {
    saveEnvironments: mutation.mutate,
    saveEnvironmentsAsync: mutation.mutateAsync,
    saveEnvironmentsLoading: mutation.isPending,
  };
}
