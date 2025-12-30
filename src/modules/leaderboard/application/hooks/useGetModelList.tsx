import { useQuery } from "@tanstack/react-query";
import { useGlobalSettings } from "@/modules/settings/application/hooks/useGlobalSettings";
import { getModelList } from "../../infrastructure/services";
import { initialSettings } from "@/modules/settings/domain/initial-config";

export const useGetModelList = () => {
  const { settings } = useGlobalSettings();

  const query = useQuery({
    queryKey: ["modelList", settings?.endpoints?.models],
    queryFn: async () => {
      try {
        if (!settings?.endpoints?.models) {
          console.error("Model list endpoint not found in settings");
          return getModelList(initialSettings.endpoints.models);
        }
        return getModelList(settings.endpoints.models);
      } catch (error) {
        console.error("Error fetching model list:", error);
        return [];
      }
    },
    enabled: !!settings,
  });

  return { models: query.data, modelsLoading: query.isLoading };
};
