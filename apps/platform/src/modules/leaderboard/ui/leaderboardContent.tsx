"use client";

import { LeaderboardTable } from "@coordinator/leaderboard/src/ui/leaderboardTable";
import { ColumnSettingsTable } from "@coordinator/leaderboard/src/ui/columnSettingsTable";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { useGetLeaderboard } from "../application/hooks/useGetLeaderboard";
import { useLocalLeaderboardColumns } from "../application/hooks/useLocalLeaderboardColumns";
import { useAddLocalColumn } from "../application/hooks/useAddLocalColumn";
import { useUpdateLocalColumn } from "../application/hooks/useUpdateLocalColumn";
import { useRemoveLocalColumn } from "../application/hooks/useRemoveLocalColumn";
import { useResetLocalColumns } from "../application/hooks/useResetLocalColumns";

export function LeaderboardContent() {
  const { crunchName } = useCrunchContext();

  const { leaderboard, leaderboardLoading } = useGetLeaderboard();
  const { columns, columnsLoading } = useLocalLeaderboardColumns(crunchName);
  const { addColumn, addColumnLoading } = useAddLocalColumn(crunchName);
  const { updateColumn, updateColumnLoading } = useUpdateLocalColumn(crunchName);
  const { removeColumn, removeColumnLoading } = useRemoveLocalColumn(crunchName);
  const { resetColumns, resetColumnsLoading } = useResetLocalColumns(crunchName);

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
