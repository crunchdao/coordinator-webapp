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
  DataTable,
  Spinner,
} from "@crunch-ui/core";
import { SolanaAddressLink } from "@crunchdao/solana-utils";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { useLocalCompetitionEnvironments } from "@/modules/config/application/hooks/useLocalCompetitionEnvironments";
import { EnvironmentSelector } from "@/modules/config/ui/environmentSelector";
import { useGetCrunchForNetwork } from "@/modules/crunch/application/hooks/useGetCrunchForNetwork";
import { useGetCheckpoints } from "../application/hooks/useGetCheckpoints";
import { useGetNodeCheckpoints } from "../application/hooks/useGetNodeCheckpoints";
import { Checkpoint, CheckpointPrize, CheckpointStatus } from "../domain/types";
import { NodeCheckpoint, NodeCheckpointStatus } from "../domain/nodeTypes";
import { CheckpointStatusBadge } from "./checkpointStatusBadge";
import { NodeCheckpointsTable } from "./nodeCheckpointsTable";
import { SettleCheckpointDialog } from "./settleCheckpointDialog";

type DataSource = "on-chain" | "crunch-node";

const ON_CHAIN_STATUS_OPTIONS: {
  value: CheckpointStatus | "all";
  label: string;
}[] = [
  { value: "all", label: "All statuses" },
  { value: "LoadingPrizes", label: "Processing" },
  { value: "LoadedPrizes", label: "Loaded" },
  { value: "FullyClaimed", label: "Finished" },
];

const NODE_STATUS_OPTIONS: {
  value: NodeCheckpointStatus | "all";
  label: string;
}[] = [
  { value: "all", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "CLAIMABLE", label: "Claimable" },
  { value: "PAID", label: "Paid" },
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
      return `${usdc.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} USDC`;
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
  const { crunchName: slug, crunchData } = useCrunchContext();
  const { environments, environmentsLoading } =
    useLocalCompetitionEnvironments(slug);

  const [selectedEnvName, setSelectedEnvName] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<DataSource>("on-chain");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCheckpoint, setSelectedCheckpoint] =
    useState<Checkpoint | null>(null);
  const [settleCheckpoint, setSettleCheckpoint] =
    useState<NodeCheckpoint | null>(null);

  const envName = selectedEnvName ?? environments?.[0]?.name;
  const selectedEnv = environments?.find((e) => e.name === envName) ?? null;

  const payoutAmount = Number(crunchData?.payoutAmount ?? "0");

  const { crunch, crunchLoading } = useGetCrunchForNetwork(
    selectedEnv?.address,
    selectedEnv?.network
  );

  const onChainStatus =
    dataSource === "on-chain" && statusFilter !== "all"
      ? (statusFilter as CheckpointStatus)
      : undefined;

  const nodeStatus =
    dataSource === "crunch-node" && statusFilter !== "all"
      ? (statusFilter as NodeCheckpointStatus)
      : undefined;

  const { checkpoints, checkpointsLoading } = useGetCheckpoints(
    dataSource === "on-chain" && crunch?.name
      ? {
          crunchNames: [crunch.name],
          status: onChainStatus,
        }
      : undefined
  );

  const { nodeCheckpoints, nodeCheckpointsLoading } = useGetNodeCheckpoints(
    dataSource === "crunch-node" ? selectedEnv?.coordinatorNodeUrl : undefined,
    nodeStatus
  );

  const sortedCheckpoints = useMemo(
    () => [...checkpoints].sort((a, b) => b.index - a.index),
    [checkpoints]
  );

  const isLoading =
    dataSource === "on-chain"
      ? crunchLoading || checkpointsLoading
      : nodeCheckpointsLoading;

  const itemCount =
    dataSource === "on-chain"
      ? sortedCheckpoints.length
      : nodeCheckpoints.length;

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
        return `${usdc.toLocaleString(undefined, {
          minimumFractionDigits: 2,
        })} USDC`;
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

  if (environmentsLoading) {
    return (
      <div className="flex flex-1 items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  const hasEnvironments = environments && environments.length > 0;
  const statusOptions =
    dataSource === "on-chain" ? ON_CHAIN_STATUS_OPTIONS : NODE_STATUS_OPTIONS;

  const handleDataSourceChange = (v: string) => {
    setDataSource(v as DataSource);
    setStatusFilter("all");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Checkpoints</CardTitle>
              <CardDescription>
                {isLoading
                  ? "Loading checkpoints..."
                  : `${itemCount} checkpoint(s) found`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {hasEnvironments && (
                <EnvironmentSelector
                  environments={environments}
                  value={envName}
                  onChange={setSelectedEnvName}
                />
              )}
              <Select value={dataSource} onValueChange={handleDataSourceChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on-chain">Crunch Protocol</SelectItem>
                  <SelectItem value="crunch-node">Crunch Node</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
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
          {!hasEnvironments ? (
            <p className="text-muted-foreground text-sm">
              No environments configured. Go to the Environments page to add
              one.
            </p>
          ) : dataSource === "on-chain" ? (
            <DataTable
              columns={columns}
              data={sortedCheckpoints}
              loading={crunchLoading || checkpointsLoading}
            />
          ) : (
            <NodeCheckpointsTable
              data={nodeCheckpoints}
              loading={nodeCheckpointsLoading}
              onSettle={setSettleCheckpoint}
            />
          )}
        </CardContent>
      </Card>

      {selectedCheckpoint && (
        <CheckpointDetail
          checkpoint={selectedCheckpoint}
          onClose={() => setSelectedCheckpoint(null)}
        />
      )}

      {settleCheckpoint && selectedEnv?.coordinatorNodeUrl && (
        <SettleCheckpointDialog
          open={!!settleCheckpoint}
          onOpenChange={(open) => {
            if (!open) setSettleCheckpoint(null);
          }}
          checkpoint={settleCheckpoint}
          payoutAmount={payoutAmount}
          coordinatorNodeUrl={selectedEnv.coordinatorNodeUrl}
        />
      )}
    </div>
  );
}
