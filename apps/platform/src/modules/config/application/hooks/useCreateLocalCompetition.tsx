"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { showApiErrorToast } from "@/utils/api/apiClient";
import {
  saveLocalCompetitionEnvironments,
  saveLocalCompetitionSettings,
} from "../../infrastructure/service";
import type { CompetitionEnvironments } from "../../domain/types";
import type { Competition } from "@/modules/competition/domain/types";

interface CreateCompetitionPayload {
  slug: string;
  environments: CompetitionEnvironments;
  settings: Competition;
}

export function useCreateLocalCompetition() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateCompetitionPayload) => {
      await saveLocalCompetitionEnvironments(
        payload.slug,
        payload.environments
      );
      await saveLocalCompetitionSettings(payload.slug, payload.settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["localCrunches"] });
      toast({ title: "Competition created successfully" });
    },
    onError: (error) => {
      showApiErrorToast(error, "Failed to create competition");
    },
  });

  return {
    createCompetition: mutation.mutate,
    createCompetitionAsync: mutation.mutateAsync,
    createCompetitionLoading: mutation.isPending,
  };
}
