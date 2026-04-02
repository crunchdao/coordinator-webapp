"use client";
import { LeaderboardTable } from "@coordinator/leaderboard/src/ui/leaderboardTable";
import { useGetLeaderboard } from "@/modules/leaderboard/application/hooks/useGetLeaderboard";
import { useLeaderboardColumns } from "@/modules/leaderboard/application/hooks/useLeaderboardColumns";

export default function LeaderboardPage() {
  const { leaderboard, leaderboardLoading } = useGetLeaderboard();
  const { columns, columnsLoading } = useLeaderboardColumns();

  return (
    <LeaderboardTable
      leaderboard={leaderboard}
      columns={columns}
      loading={leaderboardLoading || columnsLoading}
    />
  );
}
