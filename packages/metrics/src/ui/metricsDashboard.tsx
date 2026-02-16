"use client";
import { useMemo, useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Spinner,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@crunch-ui/core";
import { InfoCircle } from "@crunch-ui/icons";
import { MetricWidget } from "@crunchdao/chart";
import type { Widget as SharedWidget, ChartWidget } from "@crunchdao/chart";
import MultiSelectDropdown from "@coordinator/ui/src/multi-select-dropdown";
import { GetMetricDataParams, Widget, BarChartDefinition } from "../domain/types";
import { useMetricData } from "../application/hooks/useMetricData";
import { BarChart } from "./barChart";
import { MetricFilters } from "@crunchdao/chart";

export interface MetricsModelItem {
  model_id: string | number;
  model_name: string;
  cruncher_name: string;
}

export interface MetricsDashboardProps {
  models?: MetricsModelItem[];
  modelsLoading?: boolean;
  widgets?: Widget[];
  widgetsLoading?: boolean;
  includeEnsembles?: boolean;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  models = [],
  modelsLoading = false,
  widgets = [],
  widgetsLoading = false,
  includeEnsembles = false,
}) => {
  const [selectedModelIds, setSelectedModelIds] = useState<string[] | null>(
    null
  );

  const modelIdToName = useMemo(() => {
    if (!models) return {};
    return models.reduce((acc, model) => {
      if (model.model_id) {
        acc[
          String(model.model_id)
        ] = `${model.cruncher_name}/${model.model_name}`;
      }
      return acc;
    }, {} as Record<string, string>);
  }, [models]);

  const getModelLabel = useCallback(
    (modelId: string | number) => {
      const id = String(modelId);
      return modelIdToName[id] || id;
    },
    [modelIdToName]
  );

  useEffect(() => {
    if (models && models.length > 0 && selectedModelIds === null) {
      const firstModelId = String(models[0].model_id || "");
      setSelectedModelIds([firstModelId]);
    }
  }, [models, selectedModelIds]);

  const selectedModels = useMemo(() => {
    if (!models) return [];

    if (selectedModelIds === null) {
      return [];
    }

    return models.filter((model) =>
      selectedModelIds.includes(String(model.model_id || ""))
    );
  }, [models, selectedModelIds]);

  const handleSelectionChange = (models: MetricsModelItem[]) => {
    const ids = models.map((item) => String(item.model_id || ""));
    setSelectedModelIds(ids);
  };

  const metricParams = useMemo<GetMetricDataParams>(() => {
    const modelIds = selectedModels
      .map((item) => String(item.model_id || ""))
      .filter(Boolean);

    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);

    return {
      modelIds,
      start: start.toISOString(),
      end: end.toISOString(),
      includeEnsembles,
    };
  }, [selectedModels, includeEnsembles]);

  const { widgets: widgetsWithData, isLoading: dataLoading } = useMetricData(
    widgets,
    metricParams
  );

  const barWidgetOriginals = useMemo(() => {
    const map: Record<number, BarChartDefinition> = {};
    (widgets || []).forEach((w) => {
      if (
        "nativeConfiguration" in w &&
        w.nativeConfiguration &&
        "type" in w.nativeConfiguration &&
        w.nativeConfiguration.type === "bar"
      ) {
        map[w.id] = w as BarChartDefinition;
      }
    });
    return map;
  }, [widgets]);

  if (widgetsLoading || modelsLoading || dataLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!widgets || widgets.length === 0) {
    return (
      <p className="text-muted-foreground text-center">No metrics configured</p>
    );
  }

  return (
    <Card displayCorners>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Metrics Dashboard</CardTitle>
          {models && models.length > 0 && (
            <MultiSelectDropdown
              items={models}
              values={selectedModels}
              onValuesChange={handleSelectionChange}
              triggerLabel="Models"
              getItemKey={(item) => item.model_id || ""}
              getItemLabel={(item) =>
                item.cruncher_name + "/" + item.model_name || "Unknown"
              }
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {widgetsWithData.map((widget, index) => {
          const originalWidget = widgets[index];
          const isBarChart =
            originalWidget &&
            "nativeConfiguration" in originalWidget &&
            originalWidget.nativeConfiguration &&
            "type" in originalWidget.nativeConfiguration &&
            originalWidget.nativeConfiguration.type === "bar";

          if (isBarChart) {
            const barWidget = originalWidget as BarChartDefinition;
            const chartWidget = widget as ChartWidget;
            return (
              <BarChartWidget
                key={widget.id}
                barWidget={barWidget}
                data={chartWidget.data || []}
                getModelLabel={getModelLabel}
              />
            );
          }

          return (
            <MetricWidget
              key={widget.id}
              widget={widget}
              getModelLabel={getModelLabel}
            />
          );
        })}
      </CardContent>
    </Card>
  );
};

// Internal wrapper for bar chart widgets with filter support
type MetricItem = Record<string, string | number | null | boolean | undefined>;

interface BarChartWidgetProps {
  barWidget: BarChartDefinition;
  data: MetricItem[];
  getModelLabel: (id: string | number) => string;
}

const BarChartWidget: React.FC<BarChartWidgetProps> = ({
  barWidget,
  data,
  getModelLabel,
}) => {
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string | string[]>
  >({});

  const config = barWidget.nativeConfiguration;
  const hasFilters = (config.filterConfig?.length ?? 0) > 0;

  const handleFilterChange = (property: string, value: string | string[]) => {
    setSelectedFilters((prev) => ({ ...prev, [property]: value }));
  };

  return (
    <div>
      <div className="flex items-end justify-between mb-2">
        <h3 className="title-sm">
          {barWidget.displayName}
          {barWidget.tooltip && (
            <Tooltip>
              <TooltipTrigger className="ml-3">
                <InfoCircle />
              </TooltipTrigger>
              <TooltipContent>{barWidget.tooltip}</TooltipContent>
            </Tooltip>
          )}
        </h3>
        {hasFilters && data.length > 0 && (
          <div className="flex items-end gap-3 flex-wrap">
            <MetricFilters
              filters={config.filterConfig || []}
              data={data}
              onFilterChange={handleFilterChange}
              selectedFilters={selectedFilters}
            />
          </div>
        )}
      </div>
      <BarChart
        data={data}
        config={config}
        projectIdProperty="model_id"
        getLabel={getModelLabel}
        selectedFilters={selectedFilters}
      />
    </div>
  );
};
