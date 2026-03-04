import { Metadata } from "next";
import { CompetitionList } from "@/modules/config/ui/competitionList";

export const metadata: Metadata = {
  title: "Crunches",
};

export default function CompetitionsPage() {
  return <CompetitionList />;
}
