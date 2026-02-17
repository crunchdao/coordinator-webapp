"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@crunch-ui/core";
import { DataTable } from "@coordinator/ui/src/data-table";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { useGetPendingNodeCheckpoints } from "../application/hooks/useGetPendingNodeCheckpoints";
import { NodeCheckpoint } from "../domain/nodeTypes";
import { SettleCheckpointDialog } from "./settleCheckpointDialog";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString();
}

export function PendingNodeCheckpoints() {
  const { crunchData } = useCrunchContext();
  const { pendingCheckpoints, pendingCheckpointsLoading, pendingCheckpointsError } =
    useGetPendingNodeCheckpoints();

  const [settleCheckpoint, setSettleCheckpoint] =
    useState<NodeCheckpoint | null>(null);

  const payoutAmount = Number(crunchData?.payoutAmount ?? "0");

  if (pendingCheckpointsError) {
    return null;
  }

  if (pendingCheckpointsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Checkpoints</CardTitle>
          <CardDescription>Loading from coordinator node...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (pendingCheckpoints.length === 0) {
    return null;
  }

  const columns: ColumnDef<NodeCheckpoint>[] = [
    {
      accessorKey: "id",
      header: "Checkpoint",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.id}</span>
      ),
    },
    {
      id: "period",
      header: "Period",
      cell: ({ row }) => (
        <span className="text-xs">
          {formatDate(row.original.period_start)} →{" "}
          {formatDate(row.original.period_end)}
        </span>
      ),
    },
    {
      id: "models",
      header: "Models",
      cell: ({ row }) =>
        row.original.meta.model_count ??
        (row.original.meta.ranking?.length ?? 0),
    },
    {
      id: "snapshots",
      header: "Snapshots",
      cell: ({ row }) => row.original.meta.snapshot_count ?? 0,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: () => <Badge variant="outline">PENDING</Badge>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button size="sm" onClick={() => setSettleCheckpoint(row.original)}>
          Settle
        </Button>
      ),
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Pending Checkpoints</CardTitle>
          <CardDescription>
            {pendingCheckpoints.length} checkpoint(s) ready to be settled
            on-chain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={pendingCheckpoints} />
        </CardContent>
      </Card>

      {settleCheckpoint && (
        <SettleCheckpointDialog
          open={!!settleCheckpoint}
          onOpenChange={(open) => {
            if (!open) setSettleCheckpoint(null);
          }}
          checkpoint={settleCheckpoint}
          payoutAmount={payoutAmount}
        />
      )}
    </>
  );
}
