import { Metadata } from "next";
import { LeaderboardTable } from "@/modules/leaderboard/ui/leaderboardTable";
import { ColumnSettingsTable } from "@/modules/leaderboard/ui/columnSettingsTable";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "View and configure leaderboard columns and rankings",
};

export default function LeaderboardConfigurationPage() {
  return (
    <>
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <ColumnSettingsTable />
        <LeaderboardTable />
      </div>
    </>
  );
}
