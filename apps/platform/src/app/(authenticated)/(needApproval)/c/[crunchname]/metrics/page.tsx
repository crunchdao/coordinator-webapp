import { Metadata } from "next";
import { MetricsContent } from "./content";

export const metadata: Metadata = {
  title: "Metrics",
};

export default function MetricsPage() {
  return <MetricsContent />;
}
