"use client";
import { useState } from "react";
import { LeaderboardTable } from "@coordinator/leaderboard/src/ui/leaderboardTable";
import { ColumnSettingsTable } from "@coordinator/leaderboard/src/ui/columnSettingsTable";
import { Switch, Label } from "@crunch-ui/core";
import { useGetLeaderboard } from "@/modules/leaderboard/application/hooks/useGetLeaderboard";
import { useLeaderboardColumns } from "@/modules/leaderboard/application/hooks/useLeaderboardColumns";
import { useAddColumn } from "@/modules/leaderboard/application/hooks/useAddColumn";
import { useUpdateColumn } from "@/modules/leaderboard/application/hooks/useUpdateColumn";
import { useRemoveColumn } from "@/modules/leaderboard/application/hooks/useRemoveColumn";
import { useResetColumns } from "@/modules/leaderboard/application/hooks/useResetColumns";

export default function LeaderboardConfigurationPage() {
  const [showEnsembles, setShowEnsembles] = useState(false);
  const { leaderboard, leaderboardLoading } = useGetLeaderboard(showEnsembles);
  const { columns, columnsLoading } = useLeaderboardColumns();
  const { addColumn, addColumnLoading } = useAddColumn();
  const { updateColumn, updateColumnLoading } = useUpdateColumn();
  const { removeColumn, removeColumnLoading } = useRemoveColumn();
  const { resetColumns, resetColumnsLoading } = useResetColumns();

  return (
    <>
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
      <div className="flex items-center gap-2 py-2">
        <Switch
          id="show-ensembles"
          checked={showEnsembles}
          onCheckedChange={setShowEnsembles}
        />
        <Label htmlFor="show-ensembles" className="text-sm cursor-pointer">
          Show Ensembles
        </Label>
      </div>
      <LeaderboardTable
        leaderboard={leaderboard}
        columns={columns}
        loading={leaderboardLoading || columnsLoading}
      />
    </>
  );
}
