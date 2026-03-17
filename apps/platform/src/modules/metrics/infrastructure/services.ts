import apiClient from "@/utils/api/apiClient";
import { AxiosError } from "axios";
import hubApiClient from "@/utils/api/hubApiClient";
import { hubRequestConfig } from "@/utils/api/hubRequestConfig";
import type { Environment } from "@/config";
import { endpoints, hubEndpoints } from "./endpoints";
import {
  Widget,
  LocalMetricsConfig,
} from "@coordinator/metrics/src/domain/types";
import { initialConfig } from "@coordinator/metrics/src/domain/initial-config";
import type {
  HubChartDefinition,
  CreateChartDefinitionPayload,
  UpdateChartDefinitionPayload,
} from "../domain/types";

export const getLocalMetricsConfig = async (
  slug: string
): Promise<LocalMetricsConfig> => {
  try {
    const response = await apiClient.get(endpoints.localMetricsWidgets(slug));
    // Backward compatibility: if the stored data is an array (old format), wrap it
    if (Array.isArray(response.data)) {
      return { widgets: response.data };
    }
    return response.data;
  } catch (error) {
    if ((error as AxiosError)?.response?.status === 404) {
      const defaultConfig: LocalMetricsConfig = {
        widgets: initialConfig,
      };
      await apiClient.put(endpoints.localMetricsWidgets(slug), defaultConfig);
      return defaultConfig;
    }
    throw error;
  }
};

export const saveLocalMetricsConfig = async (
  slug: string,
  config: LocalMetricsConfig
): Promise<void> => {
  await apiClient.put(endpoints.localMetricsWidgets(slug), config);
};

export const addLocalMetricWidget = async (
  slug: string,
  widget: Omit<Widget, "id">
): Promise<Widget> => {
  const config = await getLocalMetricsConfig(slug);
  const newWidget: Widget = {
    ...widget,
    id: Math.max(...config.widgets.map((w) => w.id), 0) + 1,
  };
  await saveLocalMetricsConfig(slug, {
    ...config,
    widgets: [...config.widgets, newWidget],
  });
  return newWidget;
};

export const updateLocalWidget = async (
  slug: string,
  id: number,
  widget: Omit<Widget, "id">
): Promise<Widget> => {
  const config = await getLocalMetricsConfig(slug);
  const index = config.widgets.findIndex((w) => w.id === id);
  if (index === -1) throw new Error("Widget not found");
  const updatedWidget: Widget = { ...widget, id };
  config.widgets[index] = updatedWidget;
  await saveLocalMetricsConfig(slug, config);
  return updatedWidget;
};

export const removeLocalMetricsWidget = async (
  slug: string,
  id: number
): Promise<void> => {
  const config = await getLocalMetricsConfig(slug);
  await saveLocalMetricsConfig(slug, {
    ...config,
    widgets: config.widgets.filter((w) => w.id !== id),
  });
};

export const resetLocalMetricsWidgets = async (slug: string): Promise<void> => {
  await saveLocalMetricsConfig(slug, {
    widgets: initialConfig,
  });
};

// Hub services

export const getChartDefinitions = async (
  competitionIdentifier: string,
  hubBaseUrl: string,
  hubEnv: Environment
): Promise<HubChartDefinition[]> => {
  const response = await hubApiClient.get(
    hubEndpoints.chartDefinitions(competitionIdentifier),
    hubRequestConfig(hubBaseUrl, hubEnv)
  );
  return response.data;
};

export const getChartDefinition = async (
  competitionIdentifier: string,
  chartDefinitionName: string,
  hubBaseUrl: string,
  hubEnv: Environment
): Promise<HubChartDefinition> => {
  const response = await hubApiClient.get(
    hubEndpoints.chartDefinition(competitionIdentifier, chartDefinitionName),
    hubRequestConfig(hubBaseUrl, hubEnv)
  );
  return response.data;
};

export const createChartDefinition = async (
  competitionIdentifier: string,
  data: CreateChartDefinitionPayload,
  hubBaseUrl: string,
  hubEnv: Environment
): Promise<HubChartDefinition> => {
  const response = await hubApiClient.post(
    hubEndpoints.chartDefinitions(competitionIdentifier),
    data,
    hubRequestConfig(hubBaseUrl, hubEnv)
  );
  return response.data;
};

export const updateChartDefinition = async (
  competitionIdentifier: string,
  chartDefinitionName: string,
  data: UpdateChartDefinitionPayload,
  hubBaseUrl: string,
  hubEnv: Environment
): Promise<HubChartDefinition> => {
  const response = await hubApiClient.patch(
    hubEndpoints.chartDefinition(competitionIdentifier, chartDefinitionName),
    data,
    hubRequestConfig(hubBaseUrl, hubEnv)
  );
  return response.data;
};

export const deleteChartDefinition = async (
  competitionIdentifier: string,
  chartDefinitionName: string,
  hubBaseUrl: string,
  hubEnv: Environment
): Promise<void> => {
  await hubApiClient.delete(
    hubEndpoints.chartDefinition(competitionIdentifier, chartDefinitionName),
    hubRequestConfig(hubBaseUrl, hubEnv)
  );
};
