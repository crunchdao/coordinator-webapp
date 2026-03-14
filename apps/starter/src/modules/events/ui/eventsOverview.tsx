"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@crunch-ui/core";
import { cn } from "@crunch-ui/utils";
import { useGetEventsOverview } from "../application/hooks/useGetEventsOverview";
import type { EventOverview, ModelPrediction } from "../domain/types";

type Filter = "all" | "resolved" | "pending";

export const EventsOverviewPage: React.FC = () => {
  const [filter, setFilter] = useState<Filter>("all");

  const { events, total, resolvedCount, pendingCount, loading, refetching } =
    useGetEventsOverview({
      limit: 200,
      resolved_only: filter === "resolved",
      pending_only: filter === "pending",
    });

  // Collect unique model names across all events for column headers
  const modelColumns = useMemo(() => {
    const models = new Map<string, string>();
    for (const event of events) {
      for (const pred of event.predictions) {
        if (!models.has(pred.model_id)) {
          models.set(pred.model_id, pred.model_name);
        }
      }
    }
    return Array.from(models.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([id, name]) => ({ id, name }));
  }, [events]);

  return (
    <div className="grid gap-6">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <SummaryCard
          label="Total Events"
          value={total}
          loading={loading}
        />
        <SummaryCard
          label="Resolved"
          value={resolvedCount}
          loading={loading}
          accent="green"
        />
        <SummaryCard
          label="Pending"
          value={pendingCount}
          loading={loading}
          accent="yellow"
        />
      </div>

      {/* Main table */}
      <Card displayCorners>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle>Event Forecasts</CardTitle>
              {refetching && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span>Updating…</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <FilterButton
                active={filter === "all"}
                onClick={() => setFilter("all")}
              >
                All
              </FilterButton>
              <FilterButton
                active={filter === "resolved"}
                onClick={() => setFilter("resolved")}
              >
                Resolved
              </FilterButton>
              <FilterButton
                active={filter === "pending"}
                onClick={() => setFilter("pending")}
              >
                Pending
              </FilterButton>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-48 gap-2 text-muted-foreground">
              <Spinner />
              <span>Loading events…</span>
            </div>
          ) : events.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              No events found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[320px]">Question</TableHead>
                    <TableHead className="text-center w-[80px]">Market</TableHead>
                    {modelColumns.map((col) => (
                      <TableHead
                        key={col.id}
                        className="text-center w-[100px]"
                      >
                        <span className="text-xs">{col.name}</span>
                      </TableHead>
                    ))}
                    <TableHead className="text-center w-[90px]">Outcome</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <EventRow
                      key={event.event_id}
                      event={event}
                      modelColumns={modelColumns}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ── Event Row ───────────────────────────────────────────────────────

function EventRow({
  event,
  modelColumns,
}: {
  event: EventOverview;
  modelColumns: { id: string; name: string }[];
}) {
  // Build a lookup: model_id → prediction
  const predByModel = useMemo(() => {
    const map = new Map<string, ModelPrediction>();
    for (const pred of event.predictions) {
      map.set(pred.model_id, pred);
    }
    return map;
  }, [event.predictions]);

  return (
    <TableRow className="group">
      {/* Question */}
      <TableCell>
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-sm leading-tight">
            {event.title || `Event ${event.event_id}`}
          </span>
          {event.cutoff && (
            <span className="text-xs text-muted-foreground">
              Cutoff: {formatCutoff(event.cutoff)}
            </span>
          )}
        </div>
      </TableCell>

      {/* Market price */}
      <TableCell className="text-center">
        {event.yes_price != null ? (
          <ProbabilityBadge value={event.yes_price} muted />
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>

      {/* Model predictions */}
      {modelColumns.map((col) => {
        const pred = predByModel.get(col.id);
        if (!pred || pred.prediction == null) {
          return (
            <TableCell key={col.id} className="text-center">
              <span className="text-muted-foreground text-xs">—</span>
            </TableCell>
          );
        }

        return (
          <TableCell key={col.id} className="text-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-block">
                  <ProbabilityBadge
                    value={pred.prediction}
                    brierScore={pred.brier_score}
                    scored={pred.scored}
                    outcome={event.outcome}
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                <div className="grid gap-1">
                  <div>
                    <span className="text-muted-foreground">Prediction: </span>
                    <span className="font-mono">
                      {(pred.prediction * 100).toFixed(1)}%
                    </span>
                  </div>
                  {pred.scored && pred.brier_score != null && (
                    <div>
                      <span className="text-muted-foreground">
                        Brier score:{" "}
                      </span>
                      <span className="font-mono">
                        {pred.brier_score.toFixed(4)}
                      </span>
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TableCell>
        );
      })}

      {/* Outcome */}
      <TableCell className="text-center">
        {event.resolved ? (
          <OutcomeBadge outcome={event.outcome} />
        ) : (
          <Badge variant="secondary" size="sm" className="text-yellow-600 dark:text-yellow-400">
            Pending
          </Badge>
        )}
      </TableCell>
    </TableRow>
  );
}

// ── Sub-components ──────────────────────────────────────────────────

function SummaryCard({
  label,
  value,
  loading,
  accent,
}: {
  label: string;
  value: number;
  loading: boolean;
  accent?: "green" | "yellow";
}) {
  const accentClass =
    accent === "green"
      ? "text-green-600 dark:text-green-400"
      : accent === "yellow"
        ? "text-yellow-600 dark:text-yellow-400"
        : "";

  return (
    <Card displayCorners>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">{label}</span>
          {loading ? (
            <Spinner />
          ) : (
            <span className={cn("text-2xl font-bold font-mono", accentClass)}>
              {value}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant={active ? "primary" : "outline"}
      size="sm"
      onClick={onClick}
      className="text-xs"
    >
      {children}
    </Button>
  );
}

function ProbabilityBadge({
  value,
  muted,
  brierScore,
  scored,
  outcome,
}: {
  value: number;
  muted?: boolean;
  brierScore?: number | null;
  scored?: boolean;
  outcome?: number | null;
}) {
  const pct = (value * 100).toFixed(0);

  // Color by accuracy when scored
  let colorClass = "text-foreground";
  if (muted) {
    colorClass = "text-muted-foreground";
  } else if (scored && brierScore != null) {
    if (brierScore <= 0.1) {
      colorClass = "text-green-600 dark:text-green-400";
    } else if (brierScore <= 0.25) {
      colorClass = "text-foreground";
    } else {
      colorClass = "text-red-600 dark:text-red-400";
    }
  } else if (outcome != null) {
    // Show directional correctness for unscored predictions
    const correct =
      (outcome === 1 && value > 0.5) || (outcome === 0 && value < 0.5);
    colorClass = correct
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center font-mono text-xs font-medium tabular-nums",
        colorClass
      )}
    >
      {pct}%
    </span>
  );
}

function OutcomeBadge({ outcome }: { outcome: number | null }) {
  if (outcome === 1) {
    return (
      <Badge variant="secondary" size="sm" className="text-green-600 dark:text-green-400 font-semibold">
        Yes
      </Badge>
    );
  }
  if (outcome === 0) {
    return (
      <Badge variant="secondary" size="sm" className="text-red-600 dark:text-red-400 font-semibold">
        No
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" size="sm" className="text-muted-foreground">
      Unknown
    </Badge>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────

function formatCutoff(cutoff: string): string {
  if (!cutoff) return "";
  try {
    const date = new Date(cutoff);
    if (Number.isNaN(date.getTime())) return cutoff;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return cutoff;
  }
}
