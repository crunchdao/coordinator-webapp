"use client";
import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Spinner,
} from "@crunch-ui/core";
import { useGetLeaderboard } from "@/modules/leaderboard/application/hooks/useGetLeaderboard";
import MultiSelectDropdown from "@/ui/multi-select-dropdown";
import { LeaderboardPosition } from "@/modules/leaderboard/domain/types";
import { useGetWidgets } from "../application/hooks/useGetWidgets";
import { GetMetricDataParams } from "../domain/types";
import { MetricWidget } from "./metricWidget";

export const MetricsDashboard: React.FC = () => {
  const { widgets, widgetsLoading } = useGetWidgets();
  const { leaderboard, leaderboardLoading } = useGetLeaderboard();

  const [selectedModelIds, setSelectedModelIds] = useState<string[] | null>(
    null
  );

  const selectedModels = useMemo(() => {
    if (!leaderboard) return [];

    if (selectedModelIds === null) {
      return leaderboard;
    }

    return leaderboard.filter((item) =>
      selectedModelIds.includes(String(item.model_id || ""))
    );
  }, [leaderboard, selectedModelIds]);

  const handleSelectionChange = (models: LeaderboardPosition[]) => {
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
    };
  }, [selectedModels]);

  if (widgetsLoading || leaderboardLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!widgets || widgets.length === 0) {
    return <p className="text-muted-foreground">No metrics configured</p>;
  }

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <p className="text-muted-foreground">No models found in leaderboard</p>
    );
  }

  return (
    <Card displayCorners className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Metrics Dashboard</CardTitle>
          {leaderboard && leaderboard.length > 0 && (
            <MultiSelectDropdown
              items={leaderboard}
              values={selectedModels}
              onValuesChange={handleSelectionChange}
              triggerLabel="Models"
              getItemKey={(item) => String(item.model_id || "")}
              getItemLabel={(item) => String(item.model_id || "Unknown")}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {widgets.map((widget) => (
          <MetricWidget key={widget.id} widget={widget} params={metricParams} />
        ))}
      </CardContent>
    </Card>
  );
};
