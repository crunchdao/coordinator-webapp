import { Metadata } from "next";
import { MetricSettingsTable } from "@coordinator/metrics/src/ui/metricSettingsTable";
import { MetricsDashboard } from "@coordinator/metrics/src/ui/metricsDashboard";

export const metadata: Metadata = {
  title: "Metrics",
  description: "Configure and view metrics dashboard widgets",
};

export default function MetricsPage() {
  return (
    <>
      <MetricSettingsTable />
      <MetricsDashboard />
    </>
  );
}
