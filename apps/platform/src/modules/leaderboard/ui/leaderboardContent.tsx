"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  toast,
} from "@crunch-ui/core";
import { Download, Export } from "@crunch-ui/icons";
import { LeaderboardTable } from "@coordinator/leaderboard/src/ui/leaderboardTable";
import { ColumnSettingsTable } from "@coordinator/leaderboard/src/ui/columnSettingsTable";
import { useQueryClient } from "@tanstack/react-query";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { useLocalCompetitionEnvironments } from "@/modules/config/application/hooks/useLocalCompetitionEnvironments";
import { useGetLeaderboard } from "../application/hooks/useGetLeaderboard";
import { useLocalLeaderboardColumns } from "../application/hooks/useLocalLeaderboardColumns";
import { useAddLocalColumn } from "../application/hooks/useAddLocalColumn";
import { useUpdateLocalColumn } from "../application/hooks/useUpdateLocalColumn";
import { useRemoveLocalColumn } from "../application/hooks/useRemoveLocalColumn";
import { useResetLocalColumns } from "../application/hooks/useResetLocalColumns";
import { useLeaderboardHubSync } from "../application/hooks/useLeaderboardHubSync";
import { saveLocalLeaderboardColumns } from "../infrastructure/services";

export function LeaderboardContent() {
  const { crunchName } = useCrunchContext();
  const queryClient = useQueryClient();

  const { environments } = useLocalCompetitionEnvironments(crunchName);
  const { leaderboard, leaderboardLoading } = useGetLeaderboard();
  const { columns, columnsLoading } = useLocalLeaderboardColumns(crunchName);
  const { addColumn, addColumnLoading } = useAddLocalColumn(crunchName);
  const { updateColumn, updateColumnLoading } = useUpdateLocalColumn(crunchName);
  const { removeColumn, removeColumnLoading } = useRemoveLocalColumn(crunchName);
  const { resetColumns, resetColumnsLoading } = useResetLocalColumns(crunchName);
  const { pullFromHub, pushToHub, isPulling, isPushing } =
    useLeaderboardHubSync();

  const handlePullFromHub = async (
    envName: string,
    address: string,
    hubUrl: string
  ) => {
    try {
      const hubColumns = await pullFromHub(address, hubUrl);
      await saveLocalLeaderboardColumns(crunchName, hubColumns);
      queryClient.invalidateQueries({
        queryKey: ["leaderboardColumns", crunchName],
      });
      toast({ title: `Columns pulled from "${envName}" successfully` });
    } catch (error) {
      toast({
        title: "Failed to pull columns",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handlePushToHub = async (
    envName: string,
    address: string,
    hubUrl: string
  ) => {
    try {
      await pushToHub(address, hubUrl, columns);
      toast({ title: `Columns pushed to "${envName}" successfully` });
    } catch (error) {
      toast({
        title: "Failed to push columns",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const pullableEnvs = environments
    ? environments.filter((env) => env.hubUrl && env.address)
    : [];

  const hubActions = pullableEnvs.length > 0 && (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={isPulling}>
            <Download />
            Pull from Hub
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {pullableEnvs.map((env) => (
            <DropdownMenuItem
              key={env.name}
              onClick={() =>
                handlePullFromHub(env.name, env.address, env.hubUrl!)
              }
            >
              {env.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={isPushing}>
            <Export />
            Push to Hub
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {pullableEnvs.map((env) => (
            <DropdownMenuItem
              key={env.name}
              onClick={() =>
                handlePushToHub(env.name, env.address, env.hubUrl!)
              }
            >
              {env.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );

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
        actions={hubActions}
      />
      <LeaderboardTable
        leaderboard={leaderboard}
        columns={columns}
        loading={leaderboardLoading || columnsLoading}
      />
    </section>
  );
}
