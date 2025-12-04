import { LeaderboardTable } from "@/modules/leaderboard/ui/leaderboardTable";
import { ColumnSettingsTable } from "@/modules/leaderboard/ui/columnSettingsTable";

export default function ChartsConfiguration() {
  return (
    <>
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <ColumnSettingsTable />
        <LeaderboardTable />
      </div>
    </>
  );
}
