"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { showApiErrorToast } from "@coordinator/utils/src/api";
import {
  saveCompetitionEnvironments,
  saveCompetitionSettings,
} from "../../infrastructure/service";
import { CompetitionEnvironments } from "../../domain/types";
import { Competition } from "@/modules/competition/domain/types";

interface CreateCompetitionPayload {
  slug: string;
  environments: CompetitionEnvironments;
  settings: Competition;
}

export function useCreateCompetition() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateCompetitionPayload) => {
      await saveCompetitionEnvironments(payload.slug, payload.environments);
      await saveCompetitionSettings(payload.slug, payload.settings);
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
