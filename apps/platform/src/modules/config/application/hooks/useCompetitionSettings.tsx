"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { showApiErrorToast } from "@coordinator/utils/src/api";
import {
  getCompetitionSettings,
  saveCompetitionSettings,
} from "../../infrastructure/service";
import { Competition } from "@/modules/competition/domain/types";

export function useCompetitionSettings(slug: string) {
  const query = useQuery({
    queryKey: ["competitionSettings", slug],
    queryFn: () => getCompetitionSettings(slug),
    enabled: !!slug,
    retry: false,
  });

  return {
    settings: query.data,
    settingsLoading: query.isLoading,
    settingsError: query.error,
  };
}

export function useSaveCompetitionSettings(slug: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: Competition) => saveCompetitionSettings(slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["competitionSettings", slug],
      });
      toast({ title: "Settings saved successfully" });
    },
    onError: (error) => {
      showApiErrorToast(error, "Failed to save settings");
    },
  });

  return {
    saveSettings: mutation.mutate,
    saveSettingsAsync: mutation.mutateAsync,
    saveSettingsLoading: mutation.isPending,
  };
}
