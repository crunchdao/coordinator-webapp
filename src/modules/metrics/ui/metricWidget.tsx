"use client";
import { useState, useEffect } from "react";
import {
  Spinner,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@crunch-ui/core";
import { InfoCircle } from "@crunch-ui/icons";
import {
  Widget,
  LineChartDefinition,
  GaugeDefinition,
  GetMetricDataParams,
  MetricItem,
} from "../domain/types";
import { useMetricData } from "../application/hooks/useMetricData";
import { LineChart } from "@/modules/chart/ui/lineChart";
import { IframeWidget } from "./iframeWidget";
import { MetricFilters } from "./metricFilter";
import uniqBy from "lodash.uniqby";
import { Gauge } from "@/modules/chart/ui/gauge";

interface MetricWidgetProps {
  widget: Widget;
  params: GetMetricDataParams;
}

export const MetricWidget: React.FC<MetricWidgetProps> = ({
  widget,
  params,
}) => {
  const { data, isLoading, error } = useMetricData(
    widget.endpointUrl,
    widget.id,
    params
  );

  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string | string[]>
  >({});
  const [filtersInitialized, setFiltersInitialized] = useState(false);

  useEffect(() => {
    if (
      widget.type === "CHART" &&
      data &&
      data.length > 0 &&
      !filtersInitialized
    ) {
      const widgetWithConfig = widget as LineChartDefinition | GaugeDefinition;
      const initialFilters: Record<string, string | string[]> = {};

      if (widgetWithConfig.nativeConfiguration.filterConfig) {
        widgetWithConfig.nativeConfiguration.filterConfig.forEach((filter) => {
          if (filter.autoSelectFirst) {
            const filteredData = data.filter(
              (row: MetricItem) =>
                row[filter.property] !== null &&
                row[filter.property] !== undefined
            );

            const uniqueData = uniqBy(
              filteredData,
              (row: MetricItem) => row[filter.property]
            );
            const uniqueValues = uniqueData
              .map((row) => String(row[filter.property]))
              .sort();

            if (uniqueValues.length > 0) {
              initialFilters[filter.property] = uniqueValues[0];
            }
          }
        });
      }

      if (Object.keys(initialFilters).length > 0) {
        setSelectedFilters(initialFilters);
      }
      setFiltersInitialized(true);
    }
  }, [data, widget, filtersInitialized]);

  const handleFilterChange = (property: string, value: string | string[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const hasFilters =
    widget.type === "CHART" &&
    ((widget as LineChartDefinition | GaugeDefinition).nativeConfiguration
      ?.filterConfig?.length ?? 0) > 0;

  return (
    <div>
      <div className="flex items-end justify-between mb-2">
        {widget.displayName && (
          <h3 className="title-sm">
            {widget.displayName}
            {widget.tooltip && (
              <Tooltip>
                <TooltipTrigger className="ml-3">
                  <InfoCircle />
                </TooltipTrigger>
                <TooltipContent>{widget.tooltip}</TooltipContent>
              </Tooltip>
            )}
          </h3>
        )}
        {(widget as LineChartDefinition | GaugeDefinition).nativeConfiguration
          .filterConfig && (
          <div className="flex items-end gap-3 flex-wrap">
            {hasFilters && data && (
              <MetricFilters
                filters={
                  (widget as LineChartDefinition | GaugeDefinition)
                    .nativeConfiguration.filterConfig!
                }
                data={data}
                onFilterChange={handleFilterChange}
                selectedFilters={selectedFilters}
              />
            )}
          </div>
        )}
      </div>
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spinner />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-[400px] text-destructive">
            <p>Failed to load data</p>
          </div>
        ) : widget.type === "CHART" && data ? (
          (widget as GaugeDefinition).nativeConfiguration.type === "gauge" ? (
            <Gauge
              config={(widget as GaugeDefinition).nativeConfiguration}
              data={data}
              selectedFilters={selectedFilters}
            />
          ) : (
            <LineChart
              data={data}
              definition={widget as LineChartDefinition}
              projectIdProperty="model_id"
              selectedFilters={selectedFilters}
            />
          )
        ) : widget.type === "IFRAME" ? (
          <IframeWidget
            displayName={widget.displayName}
            url={widget.endpointUrl}
          />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};
