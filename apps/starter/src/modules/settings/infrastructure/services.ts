import configApiClient from "@coordinator/utils/src/config-api";
import { GlobalSettings } from "../domain/types";
import { settingsEndpoints } from "./endpoints";

export const getGlobalSettings = async (): Promise<GlobalSettings> => {
  const response = await configApiClient.get(settingsEndpoints.getSettings);
  return response.data;
};

export const updateGlobalSettings = async (
  settings: Partial<GlobalSettings>
): Promise<GlobalSettings> => {
  const response = await configApiClient.put(
    settingsEndpoints.updateSettings,
    settings
  );
  return response.data;
};
