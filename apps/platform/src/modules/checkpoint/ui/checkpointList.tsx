"use client";

import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@crunch-ui/core";
import { generateLink } from "@crunch-ui/utils";
import { DataTable } from "@coordinator/ui/src/data-table";
import { SolanaAddressLink } from "@crunchdao/solana-utils";
import { INTERNAL_LINKS } from "@/utils/routes";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { useGetCheckpoints } from "../application/hooks/useGetCheckpoints";
import { Checkpoint, CheckpointStatus } from "../domain/types";
import { CheckpointStatusBadge } from "./checkpointStatusBadge";

const STATUS_OPTIONS: { value: CheckpointStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "LoadingPrizes", label: "Processing" },
  { value: "LoadedPrizes", label: "Loaded" },
  { value: "FullyClaimed", label: "Finished" },
];

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
    id: "prizes",
    header: "Prizes",
    cell: ({ row }) => row.original.prizes.length,
  },
  {
    id: "claimed",
    header: "Claimed",
    cell: ({ row }) => {
      const claimedCount = row.original.prizes.filter((p) => p.claimed).length;
      return `${claimedCount}/${row.original.prizes.length}`;
    },
  },
];

export function CheckpointList() {
  const { crunchName } = useCrunchContext();
  const [statusFilter, setStatusFilter] = useState<CheckpointStatus | "all">(
    "all"
  );

  const { checkpoints, checkpointsLoading } = useGetCheckpoints({
    crunchNames: [crunchName],
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const sortedCheckpoints = useMemo(
    () => [...checkpoints].sort((a, b) => b.index - a.index),
    [checkpoints]
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {crunchName} — {sortedCheckpoints.length} checkpoint(s)
          </CardTitle>
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
            <Link
              href={generateLink(INTERNAL_LINKS.CHECKPOINT_CREATE, {
                crunchname: crunchName,
              })}
            >
              <Button>Create Checkpoint</Button>
            </Link>
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
  );
}
