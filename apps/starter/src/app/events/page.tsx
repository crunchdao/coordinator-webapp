import { Metadata } from "next";
import { EventsOverviewPage } from "@/modules/events/ui/eventsOverview";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events",
  description: "Binary event forecasts: questions, model predictions, and resolutions",
};

export default function EventsPage() {
  return <EventsOverviewPage />;
}
