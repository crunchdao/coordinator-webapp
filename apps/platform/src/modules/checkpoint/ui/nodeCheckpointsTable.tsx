"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge, Button, DataTable } from "@crunch-ui/core";
import { NodeCheckpoint, NodeCheckpointStatus } from "../domain/nodeTypes";
import { formatDate } from "@/utils/formatDate";

const statusVariant: Record<NodeCheckpointStatus, string> = {
  PENDING: "outline",
  SUBMITTED: "secondary",
  CLAIMABLE: "primary",
  PAID: "success",
};

interface NodeCheckpointsTableProps {
  data: NodeCheckpoint[];
  loading?: boolean;
  onSettle?: (checkpoint: NodeCheckpoint) => void;
}

export function NodeCheckpointsTable({
  data,
  loading,
  onSettle,
}: NodeCheckpointsTableProps) {
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
        row.original.meta.model_count ?? row.original.meta.ranking?.length ?? 0,
    },
    {
      id: "snapshots",
      header: "Snapshots",
      cell: ({ row }) => row.original.meta.snapshot_count ?? 0,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={statusVariant[row.original.status] as "primary"}
          size="sm"
        >
          {row.original.status}
        </Badge>
      ),
    },
    ...(onSettle
      ? [
          {
            id: "actions",
            header: "",
            cell: ({ row }: { row: { original: NodeCheckpoint } }) =>
              row.original.status === "PENDING" ? (
                <Button size="sm" onClick={() => onSettle(row.original)}>
                  Settle
                </Button>
              ) : null,
          } satisfies ColumnDef<NodeCheckpoint>,
        ]
      : []),
  ];

  return <DataTable columns={columns} data={data} loading={loading} />;
}
