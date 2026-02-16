"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge, Spinner } from "@crunch-ui/core";
import {
  useGetStrategyDetail,
  useGetStrategyCandles,
} from "../application/hooks/useGetStrategyDetail";
import { STATUS_DOT, formatPct, formatPrice } from "./helpers";
import { CandlestickChart } from "./candlestickChart";
import { PnlChart } from "./pnlChart";
import { TradeLog } from "./tradeLog";

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="text-xs text-muted-foreground uppercase tracking-wide">
        {label}
      </div>
      <div className={`text-2xl font-mono font-bold mt-1 ${color || ""}`}>
        {value}
      </div>
    </div>
  );
}

export function StrategyDetail({ name }: { name: string }) {
  const { detail, detailLoading, detailError, trades } =
    useGetStrategyDetail(name);
  const [interval, setInterval] = useState("1h");
  const { candles } = useGetStrategyCandles(name, interval);

  if (detailLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (detailError || !detail) {
    return (
      <div className="text-destructive p-4">
        Error: {detailError?.message || "Strategy not found"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/strategies"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          ← Back
        </Link>
        <div className="flex items-center gap-3">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              STATUS_DOT[detail.status] || STATUS_DOT.offline
            }`}
          />
          <h1 className="text-2xl font-bold font-mono">{detail.name}</h1>
          <Badge variant="outline">{detail.model}</Badge>
          <Badge variant="secondary">{detail.trade_pair}</Badge>
        </div>
      </div>

      {/* Current position */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        Position:
        <Badge
          variant={
            detail.direction === "LONG"
              ? "primary"
              : detail.direction === "SHORT"
                ? "destructive"
                : "secondary"
          }
        >
          {detail.direction}
        </Badge>
        {detail.direction !== "FLAT" && (
          <>
            <span className="font-mono">
              @ {detail.leverage.toFixed(2)}×
            </span>
            <span>entry ${formatPrice(detail.entry_price)}</span>
          </>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          label="Total PnL"
          value={`${detail.total_pnl >= 0 ? "+" : ""}${formatPct(detail.total_pnl)}`}
          color={detail.total_pnl >= 0 ? "text-green-500" : "text-red-500"}
        />
        <StatCard
          label="Today"
          value={`${detail.pnl_today >= 0 ? "+" : ""}${formatPct(detail.pnl_today)}`}
          color={detail.pnl_today >= 0 ? "text-green-500" : "text-red-500"}
        />
        <StatCard
          label="Win Rate"
          value={`${(detail.win_rate * 100).toFixed(0)}%`}
          color={detail.win_rate >= 0.5 ? "text-green-500" : "text-red-500"}
        />
        <StatCard label="Trades" value={String(detail.total_trades)} />
        <StatCard
          label="Max DD"
          value={formatPct(detail.max_drawdown)}
          color="text-red-400"
        />
        <StatCard
          label="Profit Factor"
          value={detail.profit_factor.toFixed(2)}
          color={
            detail.profit_factor >= 1 ? "text-green-500" : "text-red-500"
          }
        />
      </div>

      <CandlestickChart
        candles={candles}
        trades={trades}
        interval={interval}
        onIntervalChange={setInterval}
      />

      <PnlChart trades={trades} />

      <TradeLog trades={trades} />
    </div>
  );
}
