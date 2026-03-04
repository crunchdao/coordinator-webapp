"use client";

import { MetricSettingsTable } from "@coordinator/metrics/src/ui/metricSettingsTable";
import { MetricsDashboard } from "@coordinator/metrics/src/ui/metricsDashboard";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { useGetWidgets } from "../application/hooks/useGetWidgets";
import { useAddWidget } from "../application/hooks/useAddWidget";
import { useUpdateWidget } from "../application/hooks/useUpdateWidget";
import { useRemoveWidget } from "../application/hooks/useRemoveWidget";
import { useResetWidgets } from "../application/hooks/useResetWidgets";

export function MetricsContent() {
  const { crunchName } = useCrunchContext();

  const { widgets, widgetsLoading } = useGetWidgets(crunchName);
  const { addWidget, addWidgetLoading } = useAddWidget(crunchName);
  const { updateWidget, updateWidgetLoading } = useUpdateWidget(crunchName);
  const { removeWidget, removeWidgetLoading } = useRemoveWidget(crunchName);
  const { resetWidgets, resetWidgetsLoading } = useResetWidgets(crunchName);

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
      <MetricsDashboard widgets={widgets} widgetsLoading={widgetsLoading} />
    </section>
  );
}
