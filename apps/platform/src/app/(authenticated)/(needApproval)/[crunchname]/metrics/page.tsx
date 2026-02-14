"use client";
import { MetricSettingsTable } from "@coordinator/metrics/src/ui/metricSettingsTable";
import { MetricsDashboard } from "@coordinator/metrics/src/ui/metricsDashboard";
import { useGetWidgets } from "@/modules/metrics/application/hooks/useGetWidgets";
import { useAddWidget } from "@/modules/metrics/application/hooks/useAddWidget";
import { useUpdateWidget } from "@/modules/metrics/application/hooks/useUpdateWidget";
import { useRemoveWidget } from "@/modules/metrics/application/hooks/useRemoveWidget";
import { useResetWidgets } from "@/modules/metrics/application/hooks/useResetWidgets";
import { useNodeStatus } from "@/modules/node/application/hooks/useNodeStatus";

export default function MetricsPage() {
  const { widgets, widgetsLoading } = useGetWidgets();
  const { addWidget, addWidgetLoading } = useAddWidget();
  const { updateWidget, updateWidgetLoading } = useUpdateWidget();
  const { removeWidget, removeWidgetLoading } = useRemoveWidget();
  const { resetWidgets, resetWidgetsLoading } = useResetWidgets();
  const { nodeStatus } = useNodeStatus();

  const models = nodeStatus.models.map((m) => ({
    model_id: m.model_id,
    model_name: m.model_name,
    cruncher_name: m.cruncher_name,
  }));

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
      />
      <MetricsDashboard
        widgets={widgets}
        widgetsLoading={widgetsLoading}
        models={models}
        modelsLoading={!nodeStatus.isOnline}
      />
    </section>
  );
}
