"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@crunch-ui/core";
import { DataTable } from "@coordinator/ui/src/data-table";
import { Trade } from "../domain/types";
import { formatPct, formatPrice, formatTime, formatDuration } from "./helpers";

const columns: ColumnDef<Trade>[] = [
  {
    id: "time",
    header: "Time",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {formatTime(row.original.ts)}
      </span>
    ),
  },
  {
    accessorKey: "closed_direction",
    header: "Dir",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.closed_direction === "LONG" ? "primary" : "destructive"
        }
        size="sm"
      >
        {row.original.closed_direction}
      </Badge>
    ),
  },
  {
    accessorKey: "leverage",
    header: "Lev",
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.original.leverage.toFixed(2)}×
      </span>
    ),
  },
  {
    accessorKey: "entry_price",
    header: "Entry",
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        ${formatPrice(row.original.entry_price)}
      </span>
    ),
  },
  {
    accessorKey: "exit_price",
    header: "Exit",
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        ${formatPrice(row.original.exit_price)}
      </span>
    ),
  },
  {
    id: "return",
    header: "Return",
    cell: ({ row }) => {
      const r = row.original.return;
      return (
        <span
          className={`font-mono text-xs ${r >= 0 ? "text-green-500" : "text-red-500"}`}
        >
          {r >= 0 ? "+" : ""}
          {formatPct(r)}
        </span>
      );
    },
  },
  {
    id: "pnl",
    header: "PnL",
    cell: ({ row }) => {
      const p = row.original.pnl;
      return (
        <span
          className={`font-mono text-xs ${p >= 0 ? "text-green-500" : "text-red-500"}`}
        >
          {p >= 0 ? "+" : ""}
          {formatPct(p)}
        </span>
      );
    },
  },
  {
    id: "cumulative",
    header: "Cumul",
    cell: ({ row }) => {
      const c = row.original.cumulative_pnl;
      return (
        <span
          className={`font-mono text-xs ${c >= 0 ? "text-green-500" : "text-red-500"}`}
        >
          {c >= 0 ? "+" : ""}
          {formatPct(c)}
        </span>
      );
    },
  },
  {
    id: "hold",
    header: "Hold",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {formatDuration(row.original.hold_seconds)}
      </span>
    ),
  },
];

export function TradeLog({ trades }: { trades: Trade[] }) {
  if (trades.length === 0) {
    return (
      <div className="text-muted-foreground text-sm p-4">No trades yet.</div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-muted/50">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Trade Log ({trades.length} trades)
        </h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        <DataTable columns={columns} data={trades} />
      </div>
    </div>
  );
}
