"use client";

import { MetricSettingsTable } from "@coordinator/metrics/src/ui/metricSettingsTable";
import { MetricsDashboard } from "@coordinator/metrics/src/ui/metricsDashboard";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { useGetLocalWidgets } from "../application/hooks/useGetLocalWidgets";
import { useAddLocalWidget } from "../application/hooks/useAddLocalWidget";
import { useUpdateLocalWidget } from "../application/hooks/useUpdateLocalWidget";
import { useRemoveLocalWidget } from "../application/hooks/useRemoveLocalWidget";
import { useResetLocalWidgets } from "../application/hooks/useResetLocalWidgets";

export function MetricsContent() {
  const { crunchName } = useCrunchContext();

  const { widgets, widgetsLoading } = useGetLocalWidgets(crunchName);
  const { addWidget, addWidgetLoading } = useAddLocalWidget(crunchName);
  const { updateWidget, updateWidgetLoading } = useUpdateLocalWidget(crunchName);
  const { removeWidget, removeWidgetLoading } = useRemoveLocalWidget(crunchName);
  const { resetWidgets, resetWidgetsLoading } = useResetLocalWidgets(crunchName);

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
