import { useQuery } from "@tanstack/react-query";
import { getGlobalSettings } from "../../infrastructure/services";
import { updateApiBaseUrl } from "@/utils/api";

export const useGlobalSettings = () => {
  const {
    data: settings,
    isLoading: settingsLoading,
    error,
  } = useQuery({
    queryKey: ["globalSettings"],
    queryFn: async () => {
      const settings = await getGlobalSettings();
      if (settings.apiBaseUrl) {
        updateApiBaseUrl(settings.apiBaseUrl);
      }
      return settings;
    },
  });

  return { settings, settingsLoading, error };
};
