"use client";
import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import apiClient from "@/utils/api/apiClient";
import type { Widget as SharedWidget, ChartWidget } from "@crunchdao/chart";
import type {
  Widget,
  GetMetricDataParams,
} from "@coordinator/metrics/src/domain/types";

export function useMetricData(widgets: Widget[], params: GetMetricDataParams) {
  const { dataByWidgetId, isLoading } = useQueries({
    queries: widgets
      .filter((w) => w.type === "CHART")
      .map((widget) => ({
        queryKey: ["metricData", widget.id, widget.endpointUrl, params],
        queryFn: async () => {
          const response = await apiClient.get(widget.endpointUrl, {
            params: {
              projectIds: params.modelIds.join(","),
              start: params.start,
              end: params.end,
            },
          });
          return { widgetId: widget.id, data: response.data };
        },
        enabled: !!widget.endpointUrl && !!params.modelIds.length,
      })),
    combine: (results) => {
      const map: Record<number, unknown[]> = {};
      for (const r of results) {
        if (r.data) {
          map[r.data.widgetId] = r.data.data;
        }
      }
      return {
        dataByWidgetId: map,
        isLoading: results.some((r) => r.isLoading),
      };
    },
  });

  const transformedWidgets = useMemo<SharedWidget[]>(() => {
    return widgets.map((widget) => {
      if (widget.type === "IFRAME") {
        return {
          id: widget.id,
          name: widget.displayName,
          type: widget.type,
          definitions: [
            {
              id: widget.id,
              displayName: widget.displayName,
              tooltip: widget.tooltip,
              order: widget.order,
              nativeConfiguration: { url: widget.endpointUrl },
            },
          ],
        };
      }

      return {
        id: widget.id,
        name: widget.displayName,
        type: widget.type,
        projectIdProperty:
          "projectIdProperty" in widget
            ? (widget.projectIdProperty as string)
            : "model_id",
        definitions: [
          {
            id: widget.id,
            displayName: widget.displayName,
            tooltip: widget.tooltip,
            order: widget.order,
            nativeConfiguration:
              "nativeConfiguration" in widget
                ? widget.nativeConfiguration
                : undefined,
          },
        ],
        data: dataByWidgetId[widget.id] || [],
      } as ChartWidget;
    });
  }, [widgets, dataByWidgetId]);

  return {
    widgets: transformedWidgets,
    isLoading,
  };
}
