import apiClient from "@/utils/api";
import configApiClient from "@/utils/config-api";
import { endpoints } from "./endpoints";
import { Widget } from "../domain/types";

export const getMetricsWidgets = async (): Promise<Widget[]> => {
  const response = await configApiClient.get(endpoints.getMetricsWidgets());
  return response.data;
};

export const addMetricWidget = async (
  widget: Omit<Widget, "id">
): Promise<Widget> => {
  const response = await configApiClient.post(
    endpoints.createMetricsWidget(),
    widget
  );
  return response.data;
};

export const updateWidget = async (
  id: number,
  widget: Omit<Widget, "id">
): Promise<Widget> => {
  const response = await configApiClient.put(
    endpoints.updateMetricsWidget(id),
    widget
  );
  return response.data;
};

export const removeMetricsWidget = async (id: number): Promise<void> => {
  await configApiClient.delete(endpoints.deleteMetricsWidget(id));
};

export const resetMetricsWidgets = async (): Promise<void> => {
  await configApiClient.post(endpoints.resetMetricsWidgets());
};
