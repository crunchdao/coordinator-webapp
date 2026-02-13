"use client";

import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@crunch-ui/core";
import { DataTable } from "@coordinator/ui/src/data-table";
import { SolanaAddressLink } from "@crunchdao/solana-utils";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { useGetCheckpoints } from "../application/hooks/useGetCheckpoints";
import { Checkpoint, CheckpointPrize, CheckpointStatus } from "../domain/types";
import { CheckpointStatusBadge } from "./checkpointStatusBadge";

const STATUS_OPTIONS: { value: CheckpointStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "LoadingPrizes", label: "Processing" },
  { value: "LoadedPrizes", label: "Loaded" },
  { value: "FullyClaimed", label: "Finished" },
];

const prizeColumns: ColumnDef<CheckpointPrize>[] = [
  {
    accessorKey: "cruncher",
    header: "Cruncher",
    cell: ({ row }) => <SolanaAddressLink address={row.original.cruncher} />,
  },
  {
    accessorKey: "prize",
    header: "Prize",
    cell: ({ row }) => {
      const usdc = row.original.prize / 10 ** 6;
      return `${usdc.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC`;
    },
  },
  {
    accessorKey: "claimed",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.claimed ? "success" : "outline"} size="sm">
        {row.original.claimed ? "Claimed" : "Unclaimed"}
      </Badge>
    ),
  },
];

function CheckpointDetail({
  checkpoint,
  onClose,
}: {
  checkpoint: Checkpoint;
  onClose: () => void;
}) {
  const totalPrize = checkpoint.prizes.reduce((sum, p) => sum + p.prize, 0);
  const totalUsdc = totalPrize / 10 ** 6;
  const claimedCount = checkpoint.prizes.filter((p) => p.claimed).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Checkpoint #{checkpoint.index}
              <CheckpointStatusBadge status={checkpoint.status} />
            </CardTitle>
            <CardDescription>
              <SolanaAddressLink address={checkpoint.address} />
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Total Payout</p>
            <p className="text-lg font-bold">
              {totalUsdc.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}{" "}
              USDC
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Crunchers</p>
            <p className="text-lg font-bold">{checkpoint.prizes.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Claimed</p>
            <p className="text-lg font-bold">
              {claimedCount} / {checkpoint.prizes.length}
            </p>
          </div>
        </div>
        <DataTable columns={prizeColumns} data={checkpoint.prizes} />
      </CardContent>
    </Card>
  );
}

export function CheckpointList() {
  const { crunchName } = useCrunchContext();
  const [statusFilter, setStatusFilter] = useState<CheckpointStatus | "all">(
    "all"
  );
  const [selectedCheckpoint, setSelectedCheckpoint] =
    useState<Checkpoint | null>(null);

  const { checkpoints, checkpointsLoading } = useGetCheckpoints({
    crunchNames: [crunchName],
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const sortedCheckpoints = useMemo(
    () => [...checkpoints].sort((a, b) => b.index - a.index),
    [checkpoints]
  );

  const columns: ColumnDef<Checkpoint>[] = [
    {
      accessorKey: "index",
      header: "Index",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <CheckpointStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => <SolanaAddressLink address={row.original.address} />,
    },
    {
      id: "payout",
      header: "Payout",
      cell: ({ row }) => {
        const total = row.original.prizes.reduce((sum, p) => sum + p.prize, 0);
        const usdc = total / 10 ** 6;
        return `${usdc.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDC`;
      },
    },
    {
      id: "claimed",
      header: "Claimed",
      cell: ({ row }) => {
        const claimedCount = row.original.prizes.filter(
          (p) => p.claimed
        ).length;
        const total = row.original.prizes.length;
        return (
          <span>
            {claimedCount}/{total}
            {claimedCount === total && total > 0 && " ✓"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedCheckpoint(row.original)}
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>On-Chain Checkpoints</CardTitle>
              <CardDescription>
                {sortedCheckpoints.length} checkpoint(s) settled on-chain
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={statusFilter}
                onValueChange={(v) =>
                  setStatusFilter(v as CheckpointStatus | "all")
                }
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={sortedCheckpoints}
            loading={checkpointsLoading}
          />
        </CardContent>
      </Card>

      {selectedCheckpoint && (
        <CheckpointDetail
          checkpoint={selectedCheckpoint}
          onClose={() => setSelectedCheckpoint(null)}
        />
      )}
    </div>
  );
}
