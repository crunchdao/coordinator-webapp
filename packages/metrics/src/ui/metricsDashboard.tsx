"use client";
import { useMemo, useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Spinner,
} from "@crunch-ui/core";
import { MetricWidget } from "@crunchdao/chart";
import MultiSelectDropdown from "@coordinator/ui/src/multi-select-dropdown";
import { GetMetricDataParams, Widget } from "../domain/types";
import { useMetricData } from "../application/hooks/useMetricData";

function readModelsFromHash(): string[] | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.slice(1);
  const params = new URLSearchParams(hash);
  const raw = params.get("models");
  if (!raw) return null;
  const ids = raw.split(",").filter(Boolean);
  return ids.length > 0 ? ids : null;
}

function writeModelsToHash(ids: string[]) {
  if (typeof window === "undefined") return;
  const hash = window.location.hash.slice(1);
  const params = new URLSearchParams(hash);
  params.set("models", ids.join(","));
  window.history.replaceState(null, "", `#${params.toString()}`);
}

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
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  models = [],
  modelsLoading = false,
  widgets = [],
  widgetsLoading = false,
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
    if (!models || models.length === 0 || selectedModelIds !== null) return;

    const fromHash = readModelsFromHash();
    if (fromHash) {
      const validIds = fromHash.filter((id) =>
        models.some((m) => String(m.model_id) === id)
      );
      if (validIds.length > 0) {
        setSelectedModelIds(validIds);
        return;
      }
    }

    setSelectedModelIds(models.map((m) => String(m.model_id || "")));
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
    writeModelsToHash(ids);
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
    };
  }, [selectedModels]);

  const { widgets: widgetsWithData, isLoading: dataLoading } = useMetricData(
    widgets,
    metricParams
  );

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
        {widgetsWithData.map((widget) => (
          <MetricWidget
            key={widget.id}
            widget={widget}
            getModelLabel={getModelLabel}
          />
        ))}
      </CardContent>
    </Card>
  );
};
