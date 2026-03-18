"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Spinner,
} from "@crunch-ui/core";
import { MetricWidget } from "@crunchdao/chart";
import type { Widget } from "@coordinator/metrics/src/domain/types";
import type { Environment } from "@/modules/config/domain/types";
import { EnvironmentSelector } from "@/modules/config/ui/environmentSelector";
import { useGetModels } from "../application/hooks/useGetModels";
import { useMetricData } from "../application/hooks/useMetricData";
import { ModelSelector } from "./modelSelector";

interface MetricsDashboardContentProps {
  environments: Environment[];
  widgets: Widget[];
  widgetsLoading: boolean;
}

export function MetricsDashboardContent({
  environments,
  widgets,
  widgetsLoading,
}: MetricsDashboardContentProps) {
  const [selectedEnvName, setSelectedEnvName] = useState<string | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

  const envName = selectedEnvName ?? environments[0]?.name;
  const selectedEnv = environments.find((e) => e.name === envName);
  const coordinatorNodeUrl = selectedEnv?.coordinatorNodeUrl;

  const { models, modelsLoading } = useGetModels(coordinatorNodeUrl);

  const modelId =
    selectedModelId ?? (models[0] ? String(models[0].model_id) : undefined);

  const handleEnvChange = (name: string) => {
    setSelectedEnvName(name);
    setSelectedModelId(null);
  };

  const getModelLabel = useCallback(
    (modelId: string | number) => {
      const model = models.find((m) => String(m.model_id) === String(modelId));
      return model
        ? `${model.cruncher_name}/${model.model_name}`
        : String(modelId);
    },
    [models]
  );

  const metricParams = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 2);

    return {
      modelIds: modelId ? [modelId] : [],
      start: start.toISOString(),
      end: end.toISOString(),
    };
  }, [modelId]);

  const { widgets: widgetsWithData, isLoading: dataLoading } = useMetricData(
    widgets,
    metricParams
  );
  return (
    <Card displayCorners>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Metrics Dashboard</CardTitle>
          <div className="flex items-center gap-2">
            {environments.length > 0 && (
              <EnvironmentSelector
                environments={environments}
                value={envName}
                onChange={handleEnvChange}
              />
            )}
            {models.length > 0 && (
              <ModelSelector
                models={models}
                value={modelId}
                onChange={setSelectedModelId}
              />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {widgetsLoading || modelsLoading || dataLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : !coordinatorNodeUrl ? (
          <p className="text-muted-foreground text-center py-8">
            No coordinator node URL configured for this environment
          </p>
        ) : widgets.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No metrics configured
          </p>
        ) : (
          widgetsWithData.map((widget) => (
            <MetricWidget
              key={widget.id}
              widget={widget}
              getModelLabel={getModelLabel}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
