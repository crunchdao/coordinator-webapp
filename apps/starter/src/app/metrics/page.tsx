"use client";
import { MetricSettingsTable } from "@coordinator/metrics/src/ui/metricSettingsTable";
import { MetricsDashboard } from "@coordinator/metrics/src/ui/metricsDashboard";
import { useGetModelList } from "@/modules/model/application/hooks/useGetModelList";

export default function MetricsPage() {
  const { models, modelsLoading } = useGetModelList();

  return (
    <>
      <MetricSettingsTable />
      <MetricsDashboard models={models} modelsLoading={modelsLoading} />
    </>
  );
}
