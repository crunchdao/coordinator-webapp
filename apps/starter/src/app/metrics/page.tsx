"use client";
import { useState } from "react";
import { MetricSettingsTable } from "@coordinator/metrics/src/ui/metricSettingsTable";
import { MetricsDashboard } from "@coordinator/metrics/src/ui/metricsDashboard";
import { Switch, Label } from "@crunch-ui/core";
import { useGetModelList } from "@/modules/model/application/hooks/useGetModelList";
import { useGetWidgets } from "@/modules/metrics/application/hooks/useGetWidgets";
import { useAddWidget } from "@/modules/metrics/application/hooks/useAddWidget";
import { useUpdateWidget } from "@/modules/metrics/application/hooks/useUpdateWidget";
import { useRemoveWidget } from "@/modules/metrics/application/hooks/useRemoveWidget";
import { useResetWidgets } from "@/modules/metrics/application/hooks/useResetWidgets";

export default function MetricsPage() {
  const [showEnsembles, setShowEnsembles] = useState(false);
  const { models, modelsLoading } = useGetModelList();
  const { widgets, widgetsLoading } = useGetWidgets();
  const { addWidget, addWidgetLoading } = useAddWidget();
  const { updateWidget, updateWidgetLoading } = useUpdateWidget();
  const { removeWidget, removeWidgetLoading } = useRemoveWidget();
  const { resetWidgets, resetWidgetsLoading } = useResetWidgets();

  return (
    <>
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
      />
      <div className="flex items-center gap-2 py-2">
        <Switch
          id="show-ensembles"
          checked={showEnsembles}
          onCheckedChange={setShowEnsembles}
        />
        <Label htmlFor="show-ensembles" className="text-sm cursor-pointer">
          Show Ensembles
        </Label>
      </div>
      <MetricsDashboard
        models={models}
        modelsLoading={modelsLoading}
        widgets={widgets}
        widgetsLoading={widgetsLoading}
        includeEnsembles={showEnsembles}
      />
    </>
  );
}
