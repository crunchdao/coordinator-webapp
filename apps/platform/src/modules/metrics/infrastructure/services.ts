import apiClient from "@coordinator/utils/src/api";
import { endpoints } from "./endpoints";
import { Widget } from "@coordinator/metrics/src/domain/types";
import { initialConfig } from "@coordinator/metrics/src/domain/initial-config";

export const getLocalMetricsWidgets = async (slug: string): Promise<Widget[]> => {
  try {
    const response = await apiClient.get(endpoints.localMetricsWidgets(slug));
    return response.data;
  } catch (error) {
    if ((error as any)?.response?.status === 404) {
      await apiClient.put(endpoints.localMetricsWidgets(slug), initialConfig);
      return initialConfig;
    }
    throw error;
  }
};

export const addLocalMetricWidget = async (
  slug: string,
  widget: Omit<Widget, "id">
): Promise<Widget> => {
  const widgets = await getLocalMetricsWidgets(slug);
  const newWidget: Widget = {
    ...widget,
    id: Math.max(...widgets.map((w) => w.id), 0) + 1,
  };
  const updated = [...widgets, newWidget];
  await apiClient.put(endpoints.localMetricsWidgets(slug), updated);
  return newWidget;
};

export const updateLocalWidget = async (
  slug: string,
  id: number,
  widget: Omit<Widget, "id">
): Promise<Widget> => {
  const widgets = await getLocalMetricsWidgets(slug);
  const index = widgets.findIndex((w) => w.id === id);
  if (index === -1) throw new Error("Widget not found");
  const updatedWidget: Widget = { ...widget, id };
  widgets[index] = updatedWidget;
  await apiClient.put(endpoints.localMetricsWidgets(slug), widgets);
  return updatedWidget;
};

export const removeLocalMetricsWidget = async (
  slug: string,
  id: number
): Promise<void> => {
  const widgets = await getLocalMetricsWidgets(slug);
  const updated = widgets.filter((w) => w.id !== id);
  await apiClient.put(endpoints.localMetricsWidgets(slug), updated);
};

export const resetLocalMetricsWidgets = async (slug: string): Promise<void> => {
  await apiClient.put(endpoints.localMetricsWidgets(slug), initialConfig);
};
