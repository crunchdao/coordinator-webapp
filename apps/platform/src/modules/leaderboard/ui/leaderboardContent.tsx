"use client";

import { useState, useEffect } from "react";
import type { Environment } from "@/config";
import {
  Button,
  Input,
  Label,
  Spinner,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  toast,
} from "@crunch-ui/core";
import { InfoCircle } from "@crunch-ui/icons";
import { LeaderboardTable } from "@coordinator/leaderboard/src/ui/leaderboardTable";
import { ColumnSettingsTable } from "@coordinator/leaderboard/src/ui/columnSettingsTable";
import { useQueryClient } from "@tanstack/react-query";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { useLocalCompetitionEnvironments } from "@/modules/config/application/hooks/useLocalCompetitionEnvironments";
import { EnvironmentSelector } from "@/modules/config/ui/environmentSelector";
import { HubSyncButtons } from "@/modules/hub/ui/hubSyncButtons";
import { useGetLeaderboard } from "../application/hooks/useGetLeaderboard";
import { useLocalLeaderboardColumns } from "../application/hooks/useLocalLeaderboardColumns";
import { useAddLocalColumn } from "../application/hooks/useAddLocalColumn";
import { useUpdateLocalColumn } from "../application/hooks/useUpdateLocalColumn";
import { useRemoveLocalColumn } from "../application/hooks/useRemoveLocalColumn";
import { useResetLocalColumns } from "../application/hooks/useResetLocalColumns";
import { useLeaderboardHubSync } from "../application/hooks/useLeaderboardHubSync";
import { saveLocalLeaderboardConfig } from "../infrastructure/services";

export function LeaderboardContent() {
  const { crunchName } = useCrunchContext();
  const queryClient = useQueryClient();

  const { environments, environmentsLoading } =
    useLocalCompetitionEnvironments(crunchName);

  const [selectedEnvName, setSelectedEnvName] = useState<string | null>(null);

  const envName = selectedEnvName ?? environments?.[0]?.name;
  const selectedEnv = environments?.find((e) => e.name === envName) ?? null;

  const { columns, externalUrl, columnsLoading } =
    useLocalLeaderboardColumns(crunchName);
  const { leaderboard, leaderboardLoading } = useGetLeaderboard(
    selectedEnv?.coordinatorNodeUrl
  );
  const { addColumn, addColumnLoading } = useAddLocalColumn(crunchName);
  const { updateColumn, updateColumnLoading } =
    useUpdateLocalColumn(crunchName);
  const { removeColumn, removeColumnLoading } =
    useRemoveLocalColumn(crunchName);
  const { resetColumns, resetColumnsLoading } =
    useResetLocalColumns(crunchName);
  const { pullFromHub, pushToHub, isPulling, isPushing } =
    useLeaderboardHubSync();

  const [localExternalUrl, setLocalExternalUrl] = useState(externalUrl ?? "");

  useEffect(() => {
    setLocalExternalUrl(externalUrl ?? "");
  }, [externalUrl]);

  const handleSaveExternalUrl = async () => {
    const newUrl = localExternalUrl.trim() || null;
    if (newUrl === externalUrl) return;
    try {
      await saveLocalLeaderboardConfig(crunchName, {
        externalUrl: newUrl,
        columns,
      });
      queryClient.invalidateQueries({
        queryKey: ["leaderboardColumns", crunchName],
      });
      toast({ title: "External URL saved" });
    } catch {
      toast({
        title: "Failed to save external URL",
        variant: "destructive",
      });
    }
  };

  const handlePullFromHub = async (
    envName: string,
    address: string,
    hubUrl: string,
    hubEnv: Environment
  ) => {
    try {
      const { columns: hubColumns, externalUrl: hubExternalUrl } =
        await pullFromHub(address, hubUrl, hubEnv);
      await saveLocalLeaderboardConfig(crunchName, {
        externalUrl: hubExternalUrl,
        columns: hubColumns,
      });
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
    hubUrl: string,
    hubEnv: Environment
  ) => {
    try {
      await pushToHub(
        address,
        hubUrl,
        hubEnv,
        columns,
        externalUrl ?? undefined
      );
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

  if (environmentsLoading) {
    return (
      <div className="flex flex-1 items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  const hasEnvironments = environments && environments.length > 0;

  const settingsHeader = (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="external-url">External URL</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoCircle className="w-3.5 h-3.5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              URL used by the Hub to fetch leaderboard data
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex gap-2">
          <Input
            id="external-url"
            type="url"
            placeholder="https://example.com/leaderboard.json"
            value={localExternalUrl}
            onChange={(e) => setLocalExternalUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveExternalUrl();
            }}
          />
          <Button
            variant="outline"
            onClick={handleSaveExternalUrl}
            disabled={localExternalUrl.trim() === (externalUrl ?? "")}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
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
        header={settingsHeader}
        actions={
          <HubSyncButtons
            isPulling={isPulling}
            isPushing={isPushing}
            onPull={handlePullFromHub}
            onPush={handlePushToHub}
          />
        }
      />
      <LeaderboardTable
        leaderboard={leaderboard}
        columns={columns}
        loading={leaderboardLoading || columnsLoading}
        actions={
          hasEnvironments ? (
            <EnvironmentSelector
              environments={environments}
              value={envName}
              onChange={setSelectedEnvName}
            />
          ) : null
        }
      />
    </section>
  );
}
