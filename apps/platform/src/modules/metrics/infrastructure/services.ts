import apiClient from "@coordinator/utils/src/api";
import { endpoints } from "./endpoints";
import { Widget } from "@coordinator/metrics/src/domain/types";

export const getMetricsWidgets = async (): Promise<Widget[]> => {
  const response = await apiClient.get(endpoints.getMetricsWidgets());
  return response.data;
};

export const addMetricWidget = async (
  widget: Omit<Widget, "id">
): Promise<Widget> => {
  const response = await apiClient.post(endpoints.getMetricsWidgets(), widget);
  return response.data;
};

export const updateWidget = async (
  id: number,
  widget: Omit<Widget, "id">
): Promise<Widget> => {
  const response = await apiClient.put(
    endpoints.updateMetricsWidget(id),
    widget
  );
  return response.data;
};

export const removeMetricsWidget = async (id: number): Promise<void> => {
  await apiClient.delete(endpoints.deleteMetricsWidget(id));
};

export const resetMetricsWidgets = async (): Promise<void> => {
  await apiClient.post(endpoints.resetMetricsWidgets());
};
