"use client";
import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import apiClient from "@coordinator/utils/src/api";
import type { Widget as SharedWidget, ChartWidget } from "@crunchdao/chart";
import { Widget, LineChartDefinition, GaugeDefinition, GetMetricDataParams } from "../../domain/types";

export const useMetricData = (
  widgets: Widget[],
  params: GetMetricDataParams
) => {
  const queries = useQueries({
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
  });

  const isLoading = queries.some((q) => q.isLoading);

  const dataByWidgetId = useMemo(() => {
    const map: Record<number, unknown[]> = {};
    queries.forEach((q) => {
      if (q.data) {
        map[q.data.widgetId] = q.data.data;
      }
    });
    return map;
  }, [queries]);

  const transformedWidgets = useMemo<SharedWidget[]>(() => {
    return widgets.map((widget) => {
      if (widget.type === "IFRAME") {
        return {
          id: widget.id,
          name: widget.displayName,
          type: "IFRAME" as const,
          definitions: [{
            id: widget.id,
            displayName: widget.displayName,
            tooltip: widget.tooltip,
            order: widget.order,
            nativeConfiguration: { url: widget.endpointUrl },
          }],
        };
      }

      const chartWidget = widget as LineChartDefinition | GaugeDefinition;
      return {
        id: widget.id,
        name: widget.displayName,
        type: "CHART" as const,
        projectIdProperty: "model_id",
        definitions: [{
          id: widget.id,
          displayName: widget.displayName,
          tooltip: widget.tooltip,
          order: widget.order,
          nativeConfiguration: chartWidget.nativeConfiguration,
        }],
        data: dataByWidgetId[widget.id] || [],
      } as ChartWidget;
    });
  }, [widgets, dataByWidgetId]);

  return {
    widgets: transformedWidgets,
    isLoading,
  };
};
