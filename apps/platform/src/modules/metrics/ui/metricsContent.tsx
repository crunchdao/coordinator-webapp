"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  toast,
} from "@crunch-ui/core";
import { Download, Export } from "@crunch-ui/icons";
import { useQueryClient } from "@tanstack/react-query";
import { MetricSettingsTable } from "@coordinator/metrics/src/ui/metricSettingsTable";
import { MetricsDashboard } from "@coordinator/metrics/src/ui/metricsDashboard";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { useLocalCompetitionEnvironments } from "@/modules/config/application/hooks/useLocalCompetitionEnvironments";
import { useGetLocalWidgets } from "../application/hooks/useGetLocalWidgets";
import { useAddLocalWidget } from "../application/hooks/useAddLocalWidget";
import { useUpdateLocalWidget } from "../application/hooks/useUpdateLocalWidget";
import { useRemoveLocalWidget } from "../application/hooks/useRemoveLocalWidget";
import { useResetLocalWidgets } from "../application/hooks/useResetLocalWidgets";
import { useMetricsHubSync } from "../application/hooks/useMetricsHubSync";
import { saveLocalMetricsConfig } from "../infrastructure/services";

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
  const { pullFromHub, pushToHub, isPulling, isPushing } =
    useMetricsHubSync();

  const handlePullFromHub = async (
    envName: string,
    address: string,
    hubUrl: string
  ) => {
    try {
      const { widgets: hubWidgets } = await pullFromHub(address, hubUrl);
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
    hubUrl: string
  ) => {
    try {
      await pushToHub(address, hubUrl, widgets ?? []);
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

  const pullableEnvs = environments
    ? environments.filter((env) => env.hubUrl && env.address)
    : [];

  const hubActions = pullableEnvs.length > 0 && (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={isPulling}>
            <Download />
            Pull from Hub
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {pullableEnvs.map((env) => (
            <DropdownMenuItem
              key={env.name}
              onClick={() =>
                handlePullFromHub(env.name, env.address, env.hubUrl!)
              }
            >
              {env.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={isPushing}>
            <Export />
            Push to Hub
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {pullableEnvs.map((env) => (
            <DropdownMenuItem
              key={env.name}
              onClick={() =>
                handlePushToHub(env.name, env.address, env.hubUrl!)
              }
            >
              {env.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );

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
        actions={hubActions}
      />
      <MetricsDashboard widgets={widgets} widgetsLoading={widgetsLoading} />
    </section>
  );
}
