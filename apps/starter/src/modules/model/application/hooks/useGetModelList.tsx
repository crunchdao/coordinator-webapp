"use client";
import { useQuery } from "@tanstack/react-query";
import { useGlobalSettings } from "@/modules/settings/application/hooks/useGlobalSettings";
import { initialSettings } from "@/modules/settings/domain/initial-config";
import apiClient from "@coordinator/utils/src/api";

export type ModelListItem = {
  model_id: string;
  model_name: string;
  cruncher_name: string;
  cruncher_id: string;
  deployment_id: string;
};

type GetModelsResponse = ModelListItem[];

const getModelList = async (
  modelListEndpoint: string
): Promise<GetModelsResponse> => {
  const response = await apiClient.get(modelListEndpoint);
  return response.data;
};

export function useGetModelList() {
  const { settings } = useGlobalSettings();

  const query = useQuery({
    queryKey: ["modelList", settings?.endpoints?.models],
    queryFn: async () => {
      try {
        if (!settings?.endpoints?.models) {
          console.error("Models endpoint not found in settings");
          return getModelList(initialSettings.endpoints.models);
        }
        return getModelList(settings.endpoints.models);
      } catch (error) {
        console.error("Error fetching model list:", error);
        return [];
      }
    },
    enabled: !!settings,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    models: query.data || [],
    modelsLoading: query.isLoading || query.isFetching,
  };
}
