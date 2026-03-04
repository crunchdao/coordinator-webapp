"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@crunch-ui/core";
import { DataTable } from "@coordinator/ui/src/data-table";
import { useGetStrategies } from "../application/hooks/useGetStrategies";
import { Strategy } from "../domain/types";
import {
  STATUS_DOT,
  STATUS_LABEL,
  formatPct,
  formatAge,
} from "./helpers";

const columns: ColumnDef<Strategy>[] = [
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${STATUS_DOT[row.original.status]}`}
        />
        <span className="text-xs text-muted-foreground">
          {STATUS_LABEL[row.original.status]}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`/strategies/${row.original.name}`}
        className="font-mono font-medium hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "model",
    header: "Model",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {row.original.model}
      </span>
    ),
  },
  {
    accessorKey: "trade_pair",
    header: "Pair",
    cell: ({ row }) => (
      <Badge variant="outline" size="sm">
        {row.original.trade_pair}
      </Badge>
    ),
  },
  {
    accessorKey: "direction",
    header: "Direction",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.direction === "LONG"
            ? "primary"
            : row.original.direction === "SHORT"
              ? "destructive"
              : "secondary"
        }
        size="sm"
      >
        {row.original.direction}
      </Badge>
    ),
  },
  {
    accessorKey: "leverage",
    header: "Leverage",
    cell: ({ row }) => (
      <span className="font-mono">{row.original.leverage.toFixed(2)}×</span>
    ),
  },
  {
    accessorKey: "total_trades",
    header: "Trades",
    cell: ({ row }) => (
      <span className="font-mono">{row.original.total_trades}</span>
    ),
  },
  {
    accessorKey: "win_rate",
    header: "Win%",
    cell: ({ row }) => (
      <span className="font-mono">
        {(row.original.win_rate * 100).toFixed(0)}%
      </span>
    ),
  },
  {
    accessorKey: "total_pnl",
    header: "PnL",
    cell: ({ row }) => {
      const pnl = row.original.total_pnl;
      return (
        <span
          className={`font-mono ${pnl >= 0 ? "text-green-500" : "text-red-500"}`}
        >
          {pnl >= 0 ? "+" : ""}
          {formatPct(pnl)}
        </span>
      );
    },
  },
  {
    accessorKey: "max_drawdown",
    header: "Max DD",
    cell: ({ row }) => (
      <span className="font-mono text-red-400">
        {formatPct(row.original.max_drawdown)}
      </span>
    ),
  },
  {
    id: "last_signal",
    header: "Last Signal",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {formatAge(row.original.last_signal_ts)}
      </span>
    ),
  },
];

export function StrategyList() {
  const { strategies, strategiesLoading, strategiesError } =
    useGetStrategies();

  if (strategiesError) {
    return (
      <div className="text-destructive p-4">
        Error loading strategies: {strategiesError.message}
      </div>
    );
  }

  if (!strategiesLoading && strategies.length === 0) {
    return (
      <div className="text-muted-foreground p-4">
        No strategies configured. Add miners to <code>miners.yml</code>.
      </div>
    );
  }

  const liveCount = strategies.filter((s) => s.status === "connected").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Strategies</h1>
        {strategies.length > 0 && (
          <Badge variant="secondary" size="sm">
            {liveCount}/{strategies.length} live
          </Badge>
        )}
      </div>

      <DataTable
        columns={columns}
        data={strategies}
        loading={strategiesLoading}
      />
    </div>
  );
}
