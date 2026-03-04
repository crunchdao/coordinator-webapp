import { Metadata } from "next";
import { OverviewSlicesView } from "@/modules/overview/ui/overviewSlicesView";

export const metadata: Metadata = {
  title: "Overview",
  description: "Manage your crunch overview content",
};

export default function OverviewPage() {
  return (
    <section className="p-6">
      <OverviewSlicesView />
    </section>
  );
}
