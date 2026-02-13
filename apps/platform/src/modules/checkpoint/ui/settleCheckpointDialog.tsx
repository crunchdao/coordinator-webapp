"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
  Button,
} from "@crunch-ui/core";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@coordinator/ui/src/data-table";
import LoadingOverlay from "@coordinator/ui/src/loading-overlay";
import { NodeCheckpoint, NodeRankedEntry } from "../domain/nodeTypes";
import { useSubmitNodeCheckpoint } from "../application/hooks/useSubmitNodeCheckpoint";

const FRAC64_MULTIPLIER = 1_000_000_000;

function formatDate(iso: string) {
  return new Date(iso).toLocaleString();
}

interface PrizeRow {
  rank: number;
  model: string;
  cruncher: string;
  share: string;
  amount: string;
}

const prizeColumns: ColumnDef<PrizeRow>[] = [
  { accessorKey: "rank", header: "Rank" },
  { accessorKey: "model", header: "Model" },
  { accessorKey: "cruncher", header: "Cruncher" },
  { accessorKey: "share", header: "Share" },
  { accessorKey: "amount", header: "Prize" },
];

function buildPrizeRows(
  checkpoint: NodeCheckpoint,
  payoutAmount: number
): PrizeRow[] {
  const emission = checkpoint.entries[0];
  if (!emission) return [];

  const ranking = checkpoint.meta.ranking ?? [];

  return emission.cruncher_rewards.map((reward) => {
    const entry =
      reward.cruncher_index < ranking.length
        ? ranking[reward.cruncher_index]
        : null;
    const pct = reward.reward_pct / FRAC64_MULTIPLIER;
    const amount = (payoutAmount * pct) / 10 ** 6;

    return {
      rank: entry?.rank ?? reward.cruncher_index + 1,
      model: entry?.model_name ?? entry?.model_id ?? `#${reward.cruncher_index}`,
      cruncher: entry?.cruncher_name ?? "-",
      share: (pct * 100).toFixed(2) + "%",
      amount: amount.toFixed(2) + " USDC",
    };
  });
}

interface SettleCheckpointDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checkpoint: NodeCheckpoint;
  payoutAmount: number;
}

export function SettleCheckpointDialog({
  open,
  onOpenChange,
  checkpoint,
  payoutAmount,
}: SettleCheckpointDialogProps) {
  const { submitNodeCheckpoint, submitLoading } = useSubmitNodeCheckpoint();
  const prizeRows = buildPrizeRows(checkpoint, payoutAmount);
  const payoutUsdc = payoutAmount / 10 ** 6;

  const handleSettle = async () => {
    await submitNodeCheckpoint({ checkpoint, payoutAmount });
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        {submitLoading && (
          <LoadingOverlay
            title="Settling Checkpoint"
            subtitle="Signing and sending transaction..."
          />
        )}
        <AlertDialogHeader>
          <AlertDialogTitle>Settle Checkpoint</AlertDialogTitle>
          <AlertDialogDescription>
            Submit this checkpoint on-chain to make prizes claimable by
            crunchers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-muted-foreground">Checkpoint</span>
            <span className="font-mono">{checkpoint.id}</span>

            <span className="text-muted-foreground">Period</span>
            <span>
              {formatDate(checkpoint.period_start)} →{" "}
              {formatDate(checkpoint.period_end)}
            </span>

            <span className="text-muted-foreground">Models</span>
            <span>{checkpoint.meta.model_count ?? prizeRows.length}</span>

            <span className="text-muted-foreground">Snapshots</span>
            <span>{checkpoint.meta.snapshot_count ?? 0}</span>

            <span className="text-muted-foreground">Payout</span>
            <span>{payoutUsdc.toLocaleString()} USDC</span>

            <span className="text-muted-foreground">Status</span>
            <Badge variant="outline">{checkpoint.status}</Badge>
          </div>

          <DataTable columns={prizeColumns} data={prizeRows} />

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSettle}
              disabled={submitLoading}
              loading={submitLoading}
            >
              Settle On-Chain
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
