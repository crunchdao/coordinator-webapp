"use client";

import { LeaderboardTable } from "@coordinator/leaderboard/src/ui/leaderboardTable";
import { ColumnSettingsTable } from "@coordinator/leaderboard/src/ui/columnSettingsTable";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { useGetLeaderboard } from "../application/hooks/useGetLeaderboard";
import { useLeaderboardColumns } from "../application/hooks/useLeaderboardColumns";
import { useAddColumn } from "../application/hooks/useAddColumn";
import { useUpdateColumn } from "../application/hooks/useUpdateColumn";
import { useRemoveColumn } from "../application/hooks/useRemoveColumn";
import { useResetColumns } from "../application/hooks/useResetColumns";

export function LeaderboardContent() {
  const { crunchName } = useCrunchContext();

  const { leaderboard, leaderboardLoading } = useGetLeaderboard();
  const { columns, columnsLoading } = useLeaderboardColumns(crunchName);
  const { addColumn, addColumnLoading } = useAddColumn(crunchName);
  const { updateColumn, updateColumnLoading } = useUpdateColumn(crunchName);
  const { removeColumn, removeColumnLoading } = useRemoveColumn(crunchName);
  const { resetColumns, resetColumnsLoading } = useResetColumns(crunchName);

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
