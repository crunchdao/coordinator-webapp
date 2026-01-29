"use client";
import { LeaderboardTable } from "@coordinator/leaderboard/src/ui/leaderboardTable";
import { ColumnSettingsTable } from "@coordinator/leaderboard/src/ui/columnSettingsTable";
import { useGetLeaderboard } from "@/modules/leaderboard/application/hooks/useGetLeaderboard";
import { useLeaderboardColumns } from "@/modules/leaderboard/application/hooks/useLeaderboardColumns";

export default function LeaderboardConfigurationPage() {
  const { leaderboard, leaderboardLoading } = useGetLeaderboard();
  const { columns, columnsLoading } = useLeaderboardColumns();

  return (
    <>
      <ColumnSettingsTable />
      <LeaderboardTable
        leaderboard={leaderboard}
        columns={columns}
        loading={leaderboardLoading || columnsLoading}
      />
    </>
  );
}
