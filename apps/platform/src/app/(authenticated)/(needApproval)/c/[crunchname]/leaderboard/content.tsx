"use client";

import { LeaderboardTable } from "@coordinator/leaderboard/src/ui/leaderboardTable";
import { ColumnSettingsTable } from "@coordinator/leaderboard/src/ui/columnSettingsTable";
import { useGetLeaderboard } from "@/modules/leaderboard/application/hooks/useGetLeaderboard";
import { useLeaderboardColumns } from "@/modules/leaderboard/application/hooks/useLeaderboardColumns";
import { useAddColumn } from "@/modules/leaderboard/application/hooks/useAddColumn";
import { useUpdateColumn } from "@/modules/leaderboard/application/hooks/useUpdateColumn";
import { useRemoveColumn } from "@/modules/leaderboard/application/hooks/useRemoveColumn";
import { useResetColumns } from "@/modules/leaderboard/application/hooks/useResetColumns";

export function LeaderboardContent() {
  const { leaderboard, leaderboardLoading } = useGetLeaderboard();
  const { columns, columnsLoading } = useLeaderboardColumns();
  const { addColumn, addColumnLoading } = useAddColumn();
  const { updateColumn, updateColumnLoading } = useUpdateColumn();
  const { removeColumn, removeColumnLoading } = useRemoveColumn();
  const { resetColumns, resetColumnsLoading } = useResetColumns();

  return (
    <section className="p-6 space-y-3">
      <ColumnSettingsTable
        columns={columns}
        loading={columnsLoading}
        onAdd={addColumn}
        onUpdate={(id, column) => updateColumn({ id, column })}
        onDelete={removeColumn}
        onReset={resetColumns}
        addLoading={addColumnLoading}
        updateLoading={updateColumnLoading}
        deleteLoading={removeColumnLoading}
        resetLoading={resetColumnsLoading}
      />
      <LeaderboardTable
        leaderboard={leaderboard}
        columns={columns}
        loading={leaderboardLoading || columnsLoading}
      />
    </section>
  );
}
