"use client";

import { CompetitionEnvironments } from "../../domain/types";
import { useConfigFile, useSaveConfigFile } from "./useConfigFile";

export function useLocalCompetitionEnvironments(slug: string) {
  const { data, isLoading, error } = useConfigFile<CompetitionEnvironments>(
    `crunches/${slug}/environments.json`
  );

  return {
    environments: data,
    environmentsLoading: isLoading,
    environmentsError: error,
  };
}

export function useSaveLocalCompetitionEnvironments(slug: string) {
  const { save, saveAsync, isSaving } =
    useSaveConfigFile<CompetitionEnvironments>(
      `crunches/${slug}/environments.json`,
      {
        successMessage: "Environments saved successfully",
        errorMessage: "Failed to save environments",
      }
    );

  return {
    saveEnvironments: save,
    saveEnvironmentsAsync: saveAsync,
    saveEnvironmentsLoading: isSaving,
  };
}
