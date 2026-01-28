import { Metadata } from "next";
import { LeaderboardTable } from "@coordinator/leaderboard/src/ui/leaderboardTable";
import { ColumnSettingsTable } from "@coordinator/leaderboard/src/ui/columnSettingsTable";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "View and configure leaderboard columns and rankings",
};

export default function LeaderboardConfigurationPage() {
  return (
    <>
      <ColumnSettingsTable />
      <LeaderboardTable />
    </>
  );
}
