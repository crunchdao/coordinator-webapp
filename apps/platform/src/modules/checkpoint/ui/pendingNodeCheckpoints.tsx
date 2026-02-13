"use client";

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
import { useSubmitNodeCheckpoint } from "../application/hooks/useSubmitNodeCheckpoint";
import { NodeCheckpoint, NodeRankedEntry } from "../domain/nodeTypes";
import LoadingOverlay from "@coordinator/ui/src/loading-overlay";

const FRAC64_MULTIPLIER = 1_000_000_000;

function formatDate(iso: string) {
  return new Date(iso).toLocaleString();
}

function formatPct(frac64: number) {
  return ((frac64 / FRAC64_MULTIPLIER) * 100).toFixed(2) + "%";
}

const rankingColumns: ColumnDef<NodeRankedEntry>[] = [
  { accessorKey: "rank", header: "Rank" },
  {
    accessorKey: "model_name",
    header: "Model",
    cell: ({ row }) => row.original.model_name || row.original.model_id,
  },
  { accessorKey: "cruncher_name", header: "Cruncher" },
  {
    accessorKey: "prediction_count",
    header: "Predictions",
    cell: ({ row }) => (row.original.prediction_count ?? 0).toLocaleString(),
  },
];

function PendingCheckpointCard({
  checkpoint,
  payoutAmount,
  onSubmit,
  submitting,
}: {
  checkpoint: NodeCheckpoint;
  payoutAmount: number;
  onSubmit: () => void;
  submitting: boolean;
}) {
  const emission = checkpoint.entries[0];
  const ranking = checkpoint.meta.ranking ?? [];
  const payoutUsdc = payoutAmount / 10 ** 6;

  // Build prize breakdown from emission
  const prizeBreakdown = emission?.cruncher_rewards.map((reward) => {
    const entry =
      reward.cruncher_index < ranking.length
        ? ranking[reward.cruncher_index]
        : null;
    const pct = reward.reward_pct / FRAC64_MULTIPLIER;
    const amount = (payoutAmount * pct) / 10 ** 6;

    return {
      rank: entry?.rank ?? reward.cruncher_index + 1,
      model_name: entry?.model_name ?? entry?.model_id ?? `#${reward.cruncher_index}`,
      cruncher_name: entry?.cruncher_name ?? "-",
      pct: formatPct(reward.reward_pct),
      amount: amount.toFixed(2) + " USDC",
    };
  }) ?? [];

  const prizeColumns: ColumnDef<(typeof prizeBreakdown)[number]>[] = [
    { accessorKey: "rank", header: "Rank" },
    { accessorKey: "model_name", header: "Model" },
    { accessorKey: "cruncher_name", header: "Cruncher" },
    { accessorKey: "pct", header: "Share" },
    { accessorKey: "amount", header: "Prize" },
  ];

  return (
    <Card className="relative overflow-hidden">
      {submitting && (
        <LoadingOverlay
          title="Submitting Checkpoint"
          subtitle="Signing and sending transaction..."
        />
      )}
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {checkpoint.id}
              <Badge variant="outline">PENDING</Badge>
            </CardTitle>
            <CardDescription>
              {formatDate(checkpoint.period_start)} →{" "}
              {formatDate(checkpoint.period_end)} ·{" "}
              {checkpoint.meta.model_count ?? ranking.length} models ·{" "}
              {checkpoint.meta.snapshot_count ?? 0} snapshots ·{" "}
              {payoutUsdc.toLocaleString()} USDC payout
            </CardDescription>
          </div>
          <Button onClick={onSubmit} disabled={submitting} loading={submitting}>
            Submit On-Chain
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={prizeColumns} data={prizeBreakdown} />
      </CardContent>
    </Card>
  );
}

export function PendingNodeCheckpoints() {
  const { crunchData } = useCrunchContext();
  const { pendingCheckpoints, pendingCheckpointsLoading, pendingCheckpointsError } =
    useGetPendingNodeCheckpoints();
  const { submitNodeCheckpoint, submitLoading } = useSubmitNodeCheckpoint();

  const payoutAmount = Number(crunchData?.payoutAmount ?? "0");

  if (pendingCheckpointsError) {
    return null; // Silently hide if node API is not reachable
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

  return (
    <div className="space-y-4">
      {pendingCheckpoints.map((checkpoint) => (
        <PendingCheckpointCard
          key={checkpoint.id}
          checkpoint={checkpoint}
          payoutAmount={payoutAmount}
          onSubmit={() =>
            submitNodeCheckpoint({ checkpoint, payoutAmount })
          }
          submitting={submitLoading}
        />
      ))}
    </div>
  );
}
