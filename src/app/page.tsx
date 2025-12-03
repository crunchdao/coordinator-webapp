import { LeaderboardTable } from "@/modules/leaderboard/ui/leaderboardTable";
import { ColumnSettingsTable } from "@/modules/leaderboard/ui/columnSettingsTable";
import { BasicNavbar } from "@/ui/navigation/basicNavbar";

export default function Home() {
  return (
    <>
      <BasicNavbar />
      <div className="mx-auto w-full max-w-7xl pt-16 space-y-6">
        <ColumnSettingsTable />
        <LeaderboardTable />
      </div>
    </>
  );
}
