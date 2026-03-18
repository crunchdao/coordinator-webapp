import { Metadata } from "next";
import { CompetitionList } from "@/modules/config/ui/competitionList";

export const metadata: Metadata = {
  title: "Crunches",
};

export default function CompetitionsPage() {
  return (
    <div className="p-6 flex flex-col gap-3">
      <CompetitionList />
    </div>
  );
}
