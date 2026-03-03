"use client";

import { Competition } from "@/modules/competition/domain/types";
import { useConfigFile, useSaveConfigFile } from "./useConfigFile";

export function useCompetitionSettings(slug: string) {
  const { data, isLoading, error } = useConfigFile<Competition>(
    `crunches/${slug}/settings.json`
  );

  return {
    settings: data,
    settingsLoading: isLoading,
    settingsError: error,
  };
}

export function useSaveCompetitionSettings(slug: string) {
  const { save, saveAsync, isSaving } = useSaveConfigFile<Competition>(
    `crunches/${slug}/settings.json`,
    {
      successMessage: "Settings saved successfully",
      errorMessage: "Failed to save settings",
    }
  );

  return {
    saveSettings: save,
    saveSettingsAsync: saveAsync,
    saveSettingsLoading: isSaving,
  };
}
