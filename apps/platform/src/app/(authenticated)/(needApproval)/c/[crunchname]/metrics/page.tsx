import { Metadata } from "next";
import { MetricsContent } from "@/modules/metrics/ui/metricsContent";

export const metadata: Metadata = {
  title: "Metrics",
};

export default function MetricsPage() {
  return <MetricsContent />;
}
