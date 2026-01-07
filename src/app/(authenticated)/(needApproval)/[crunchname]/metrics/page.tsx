import { Metadata } from "next";
import { MetricSettingsTable } from "@/modules/metrics/ui/metricSettingsTable";
import { MetricsDashboard } from "@/modules/metrics/ui/metricsDashboard";

export const metadata: Metadata = {
  title: "Metrics",
  description: "Configure and view metrics dashboard widgets",
};

export default function MetricsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <MetricSettingsTable />
      <MetricsDashboard />
    </div>
  );
}
