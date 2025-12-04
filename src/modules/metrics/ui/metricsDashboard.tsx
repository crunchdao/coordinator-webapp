"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Spinner,
} from "@crunch-ui/core";
import { useGetWidgets } from "../application/hooks/useGetWidgets";
import { useGetLeaderboard } from "@/modules/leaderboard/application/hooks/useGetLeaderboard";
import { MetricWidget } from "./metricWidget";
import { GetMetricDataParams } from "../domain/types";
import { useMemo } from "react";

export const MetricsDashboard: React.FC = () => {
  const { widgets, widgetsLoading } = useGetWidgets();
  const { leaderboard, leaderboardLoading } = useGetLeaderboard();

  const metricParams = useMemo<GetMetricDataParams | null>(() => {
    if (!leaderboard || leaderboard.length === 0) return null;
    
    const modelIds = leaderboard.map((item) => String(item.model_id || "")).filter(Boolean);
    
    // Default to last 30 days
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    return {
      modelIds,
      start: start.toISOString(),
      end: end.toISOString(),
    };
  }, [leaderboard]);

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

  if (!metricParams) {
    return <p className="text-muted-foreground">No models found in leaderboard</p>;
  }

  return (
    <Card displayCorners className="h-full">
      <CardHeader>
        <CardTitle>Metrics Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        {widgets.map((widget) => (
          <MetricWidget key={widget.id} widget={widget} params={metricParams} />
        ))}
      </CardContent>
    </Card>
  );
};
