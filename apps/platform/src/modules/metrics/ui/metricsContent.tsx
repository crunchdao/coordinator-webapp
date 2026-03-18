"use client";

import { toast } from "@crunch-ui/core";
import { useQueryClient } from "@tanstack/react-query";
import { MetricSettingsTable } from "@coordinator/metrics/src/ui/metricSettingsTable";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { useLocalCompetitionEnvironments } from "@/modules/config/application/hooks/useLocalCompetitionEnvironments";
import { HubSyncButtons } from "@/modules/hub/ui/hubSyncButtons";
import { useGetLocalWidgets } from "../application/hooks/useGetLocalWidgets";
import { useAddLocalWidget } from "../application/hooks/useAddLocalWidget";
import { useUpdateLocalWidget } from "../application/hooks/useUpdateLocalWidget";
import { useRemoveLocalWidget } from "../application/hooks/useRemoveLocalWidget";
import { useResetLocalWidgets } from "../application/hooks/useResetLocalWidgets";
import type { Environment } from "@/config";
import { useMetricsHubSync } from "../application/hooks/useMetricsHubSync";
import { saveLocalMetricsConfig } from "../infrastructure/services";
import { MetricsDashboardContent } from "./metricsDashboardContent";

export function MetricsContent() {
  const { crunchName } = useCrunchContext();
  const queryClient = useQueryClient();

  const { environments } = useLocalCompetitionEnvironments(crunchName);

  const { widgets, widgetsLoading } = useGetLocalWidgets(crunchName);
  const { addWidget, addWidgetLoading } = useAddLocalWidget(crunchName);
  const { updateWidget, updateWidgetLoading } =
    useUpdateLocalWidget(crunchName);
  const { removeWidget, removeWidgetLoading } =
    useRemoveLocalWidget(crunchName);
  const { resetWidgets, resetWidgetsLoading } =
    useResetLocalWidgets(crunchName);
  const { pullFromHub, pushToHub, isPulling, isPushing } = useMetricsHubSync();

  const handlePullFromHub = async (
    envName: string,
    address: string,
    hubUrl: string,
    hubEnv: Environment
  ) => {
    try {
      const { widgets: hubWidgets } = await pullFromHub(
        address,
        hubUrl,
        hubEnv
      );
      await saveLocalMetricsConfig(crunchName, {
        widgets: hubWidgets,
      });
      queryClient.invalidateQueries({
        queryKey: ["widgets", crunchName],
      });
      toast({ title: `Widgets pulled from "${envName}" successfully` });
    } catch (error) {
      toast({
        title: "Failed to pull widgets",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handlePushToHub = async (
    envName: string,
    address: string,
    hubUrl: string,
    hubEnv: Environment
  ) => {
    try {
      await pushToHub(address, hubUrl, hubEnv, widgets ?? []);
      toast({ title: `Widgets pushed to "${envName}" successfully` });
    } catch (error) {
      toast({
        title: "Failed to push widgets",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="p-6 space-y-3">
      <MetricSettingsTable
        widgets={widgets || []}
        loading={widgetsLoading}
        onAdd={addWidget}
        onUpdate={(id, widget) => updateWidget({ id, widget })}
        onDelete={removeWidget}
        onReset={resetWidgets}
        addLoading={addWidgetLoading}
        updateLoading={updateWidgetLoading}
        deleteLoading={removeWidgetLoading}
        resetLoading={resetWidgetsLoading}
        actions={
          <HubSyncButtons
            isPulling={isPulling}
            isPushing={isPushing}
            onPull={handlePullFromHub}
            onPush={handlePushToHub}
          />
        }
      />
      <MetricsDashboardContent
        environments={environments || []}
        widgets={widgets || []}
        widgetsLoading={widgetsLoading}
      />
    </section>
  );
}
