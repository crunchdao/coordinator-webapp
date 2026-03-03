"use client";

import { MetricSettingsTable } from "@coordinator/metrics/src/ui/metricSettingsTable";
import { MetricsDashboard } from "@coordinator/metrics/src/ui/metricsDashboard";
import { useGetWidgets } from "@/modules/metrics/application/hooks/useGetWidgets";
import { useAddWidget } from "@/modules/metrics/application/hooks/useAddWidget";
import { useUpdateWidget } from "@/modules/metrics/application/hooks/useUpdateWidget";
import { useRemoveWidget } from "@/modules/metrics/application/hooks/useRemoveWidget";
import { useResetWidgets } from "@/modules/metrics/application/hooks/useResetWidgets";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";

export function MetricsContent() {
  const { crunchName } = useCrunchContext();
  const slug = crunchName;

  const { widgets, widgetsLoading } = useGetWidgets(slug);
  const { addWidget, addWidgetLoading } = useAddWidget(slug);
  const { updateWidget, updateWidgetLoading } = useUpdateWidget(slug);
  const { removeWidget, removeWidgetLoading } = useRemoveWidget(slug);
  const { resetWidgets, resetWidgetsLoading } = useResetWidgets(slug);

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
