"use client";
import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Spinner,
} from "@crunch-ui/core";
import { MetricWidget } from "@crunchdao/chart";
import MultiSelectDropdown from "@/components/multiSelectDropdown";
import type {
  GetMetricDataParams,
  Widget,
} from "@coordinator/metrics/src/domain/types";
import { useMetricData } from "../application/hooks/useMetricData";

const DEFAULT_POLL_MS = 30_000;

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

function useCountdown(
  intervalMs: number | false,
  isRefetching: boolean
): number | null {
  const [remaining, setRemaining] = useState<number | null>(null);
  const lastFetchRef = useRef<number>(Date.now());

  const prevRefetching = useRef(isRefetching);
  useEffect(() => {
    if (prevRefetching.current && !isRefetching) {
      lastFetchRef.current = Date.now();
    }
    prevRefetching.current = isRefetching;
  }, [isRefetching]);

  useEffect(() => {
    if (!intervalMs) {
      setRemaining(null);
      return;
    }

    const tick = () => {
      const elapsed = Date.now() - lastFetchRef.current;
      const left = Math.max(0, Math.ceil((intervalMs - elapsed) / 1000));
      setRemaining(left);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [intervalMs]);

  return remaining;
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
  pollInterval?: number;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  models = [],
  modelsLoading = false,
  widgets = [],
  widgetsLoading = false,
  pollInterval = DEFAULT_POLL_MS,
}) => {
  const [selectedModelIds, setSelectedModelIds] = useState<string[] | null>(
    null
  );
  const [paused, setPaused] = useState(false);

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

    return {
      modelIds,
      windowDays: 30,
    };
  }, [selectedModels]);

  const refetchInterval = paused ? false : pollInterval;

  const {
    widgets: widgetsWithData,
    isLoading: dataLoading,
    isRefetching,
  } = useMetricData(widgets, metricParams, refetchInterval);

  const countdown = useCountdown(refetchInterval, isRefetching);

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

  const pollLabel = `${Math.round(pollInterval / 1000)}s`;

  return (
    <Card displayCorners>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle>Metrics Dashboard</CardTitle>
            {!paused && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className={
                    "inline-block h-2 w-2 rounded-full bg-green-500" +
                    (isRefetching ? " animate-pulse" : "")
                  }
                />
                <span>
                  Live · every {pollLabel}
                  {countdown !== null ? ` · ${countdown}s` : ""}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPaused((p) => !p)}
            >
              {paused ? "▶ Resume" : "⏸ Pause"}
            </Button>
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
