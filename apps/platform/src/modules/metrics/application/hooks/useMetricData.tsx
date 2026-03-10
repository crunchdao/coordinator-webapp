"use client";
import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { proxyGet } from "@/utils/api/proxyApiClient";
import type { Widget as SharedWidget, ChartWidget } from "@crunchdao/chart";
import type {
  Widget,
  GetMetricDataParams,
} from "@coordinator/metrics/src/domain/types";

function transformWidgets(
  widgets: Widget[],
  dataByWidgetId: Record<number, unknown[]>
): SharedWidget[] {
  return widgets.map((widget) => {
    if (widget.type === "IFRAME") {
      return {
        id: widget.id,
        name: widget.displayName,
        type: "IFRAME" as const,
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
      type: "CHART" as const,
      projectIdProperty: "model_id",
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
}

export function useMetricData(
  widgets: Widget[],
  params: GetMetricDataParams
) {
  const queries = useQueries({
    queries: widgets
      .filter((w) => w.type === "CHART")
      .map((widget) => ({
        queryKey: ["metricData", widget.id, widget.endpointUrl, params],
        queryFn: async () => {
          const queryString = new URLSearchParams({
            projectIds: params.modelIds.join(","),
            start: params.start,
            end: params.end,
          }).toString();

          const data = await proxyGet<unknown[]>(
            `${widget.endpointUrl}?${queryString}`
          );
          return { widgetId: widget.id, data };
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

  const transformedWidgets = useMemo(
    () => transformWidgets(widgets, dataByWidgetId),
    [widgets, dataByWidgetId]
  );

  return {
    widgets: transformedWidgets,
    isLoading,
  };
}
