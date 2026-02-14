"use client";

import { useMemo, useState } from "react";
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
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@crunch-ui/core";
import { cn } from "@crunch-ui/utils";
import { useGetCheckpoints } from "../application/hooks/useGetCheckpoints";
import { NodeCheckpoint, NodeCheckpointStatus, NodeRankedEntry } from "../domain/types";
import { CheckpointStatusBadge } from "./checkpointStatusBadge";
import { SettleUpgradeDialog } from "./settleUpgradeDialog";

const FRAC64_MULTIPLIER = 1_000_000_000;

const STATUS_OPTIONS: { value: NodeCheckpointStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "CLAIMABLE", label: "Claimable" },
  { value: "PAID", label: "Paid" },
];

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function formatPct(frac64: number): string {
  return (frac64 / FRAC64_MULTIPLIER * 100).toFixed(2) + "%";
}

function CheckpointDetail({
  checkpoint,
  onClose,
  onSettle,
}: {
  checkpoint: NodeCheckpoint;
  onClose: () => void;
  onSettle: () => void;
}) {
  const ranking = checkpoint.meta.ranking ?? [];
  const emission = checkpoint.entries[0];

  // Map cruncher_index → reward_pct
  const rewardByIndex: Record<number, number> = {};
  if (emission) {
    for (const r of emission.cruncher_rewards) {
      rewardByIndex[r.cruncher_index] = r.reward_pct;
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Checkpoint
              <span className="font-mono text-sm">{checkpoint.id.slice(0, 12)}…</span>
              <CheckpointStatusBadge status={checkpoint.status} />
            </CardTitle>
            <CardDescription>
              {formatDate(checkpoint.period_start)} → {formatDate(checkpoint.period_end)}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {checkpoint.status === "PENDING" && (
              <Button size="sm" onClick={onSettle}>
                Settle
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Models</p>
            <p className="text-lg font-bold">
              {checkpoint.meta.model_count ?? ranking.length}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Snapshots</p>
            <p className="text-lg font-bold">
              {checkpoint.meta.snapshot_count ?? 0}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="text-lg">
              <CheckpointStatusBadge status={checkpoint.status} />
            </p>
          </div>
        </div>

        {ranking.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Ranked Models</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Reward</TableHead>
                  <TableHead>Predictions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ranking
                  .sort((a, b) => a.rank - b.rank)
                  .map((entry, idx) => (
                    <TableRow key={entry.model_id}>
                      <TableCell>{entry.rank}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {entry.model_name || entry.model_id}
                      </TableCell>
                      <TableCell>
                        {rewardByIndex[idx] !== undefined
                          ? formatPct(rewardByIndex[idx])
                          : "-"}
                      </TableCell>
                      <TableCell>{entry.prediction_count ?? "-"}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        )}

        {checkpoint.tx_hash && (
          <div className="text-sm">
            <span className="text-muted-foreground">TX: </span>
            <span className="font-mono text-xs">{checkpoint.tx_hash}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function CheckpointList() {
  const [statusFilter, setStatusFilter] = useState<NodeCheckpointStatus | "all">("all");
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<NodeCheckpoint | null>(null);
  const [settleDialogOpen, setSettleDialogOpen] = useState(false);

  const { checkpoints, checkpointsLoading } = useGetCheckpoints(
    statusFilter === "all" ? undefined : statusFilter
  );

  const sortedCheckpoints = useMemo(
    () => [...checkpoints].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ),
    [checkpoints]
  );

  return (
    <div className="space-y-4">
      <Card displayCorners>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Checkpoints</CardTitle>
              <CardDescription>
                {sortedCheckpoints.length} checkpoint(s) from the coordinator node
              </CardDescription>
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as NodeCheckpointStatus | "all")}
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
        </CardHeader>
        <CardContent>
          {checkpointsLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : sortedCheckpoints.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No checkpoints found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Checkpoint</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Models</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCheckpoints.map((cp) => (
                  <TableRow
                    key={cp.id}
                    className={cn(
                      "cursor-pointer",
                      selectedCheckpoint?.id === cp.id && "bg-muted/50"
                    )}
                    onClick={() => setSelectedCheckpoint(cp)}
                  >
                    <TableCell className="font-mono text-xs">
                      {cp.id.slice(0, 12)}…
                    </TableCell>
                    <TableCell className="text-xs">
                      {formatDate(cp.period_start)} → {formatDate(cp.period_end)}
                    </TableCell>
                    <TableCell>
                      <CheckpointStatusBadge status={cp.status} />
                    </TableCell>
                    <TableCell>
                      {cp.meta.model_count ?? (cp.meta.ranking?.length ?? 0)}
                    </TableCell>
                    <TableCell className="text-xs">
                      {formatDate(cp.created_at)}
                    </TableCell>
                    <TableCell>
                      {cp.status === "PENDING" && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSettleDialogOpen(true);
                          }}
                        >
                          Settle
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedCheckpoint && (
        <CheckpointDetail
          checkpoint={selectedCheckpoint}
          onClose={() => setSelectedCheckpoint(null)}
          onSettle={() => setSettleDialogOpen(true)}
        />
      )}

      <SettleUpgradeDialog
        open={settleDialogOpen}
        onOpenChange={setSettleDialogOpen}
      />
    </div>
  );
}
