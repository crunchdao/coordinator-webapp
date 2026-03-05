"use client";

import { useState, useEffect } from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Label,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  toast,
} from "@crunch-ui/core";
import { Download, Export, InfoCircle } from "@crunch-ui/icons";
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
import { saveLocalLeaderboardConfig } from "../infrastructure/services";

export function LeaderboardContent() {
  const { crunchName } = useCrunchContext();
  const queryClient = useQueryClient();

  const { environments } = useLocalCompetitionEnvironments(crunchName);
  const { leaderboard, leaderboardLoading } = useGetLeaderboard();
  const { columns, externalUrl, columnsLoading } =
    useLocalLeaderboardColumns(crunchName);
  const { addColumn, addColumnLoading } = useAddLocalColumn(crunchName);
  const { updateColumn, updateColumnLoading } = useUpdateLocalColumn(crunchName);
  const { removeColumn, removeColumnLoading } = useRemoveLocalColumn(crunchName);
  const { resetColumns, resetColumnsLoading } = useResetLocalColumns(crunchName);
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
    hubUrl: string
  ) => {
    try {
      const { columns: hubColumns, externalUrl: hubExternalUrl } =
        await pullFromHub(address, hubUrl);
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
    hubUrl: string
  ) => {
    try {
      await pushToHub(address, hubUrl, columns, externalUrl ?? undefined);
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

  const externalUrlHeader = (
    <div className="flex items-end gap-3">
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="external-url">External URL</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoCircle className="w-3.5 h-3.5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              URL from which leaderboard data is fetched
            </TooltipContent>
          </Tooltip>
        </div>
        <Input
          id="external-url"
          type="url"
          placeholder="https://example.com/leaderboard.json"
          value={localExternalUrl}
          onChange={(e) => setLocalExternalUrl(e.target.value)}
          onBlur={handleSaveExternalUrl}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSaveExternalUrl();
          }}
        />
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
        header={externalUrlHeader}
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
