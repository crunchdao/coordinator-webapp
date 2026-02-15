"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@crunch-ui/core";

interface Strategy {
  name: string;
  model: string;
  trade_pair: string;
  miner_url: string;
  status: "connected" | "stale" | "offline";
  direction: string;
  leverage: number;
  total_trades: number;
  win_rate: number;
  total_pnl: number;
  max_drawdown: number;
  last_signal_ts: number;
}

const STATUS_DOT: Record<string, string> = {
  connected: "bg-green-500",
  stale: "bg-yellow-500",
  offline: "bg-red-500",
};

const STATUS_LABEL: Record<string, string> = {
  connected: "Live",
  stale: "Stale",
  offline: "Offline",
};

function formatPct(val: number): string {
  return (val * 100).toFixed(2) + "%";
}

function formatAge(ts: number): string {
  if (!ts) return "—";
  const age = Math.floor(Date.now() / 1000 - ts);
  if (age < 60) return `${age}s ago`;
  if (age < 3600) return `${Math.floor(age / 60)}m ago`;
  if (age < 86400) return `${Math.floor(age / 3600)}h ago`;
  return `${Math.floor(age / 86400)}d ago`;
}

export default function StrategiesPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStrategies = async () => {
    try {
      const res = await fetch("/api/strategies");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setStrategies(data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategies();
    const interval = setInterval(fetchStrategies, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading strategies...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive p-4">
        Error loading strategies: {error}
      </div>
    );
  }

  if (strategies.length === 0) {
    return (
      <div className="text-muted-foreground p-4">
        No strategies configured. Add miners to <code>miners.yml</code>.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Strategies</h1>
        <Badge variant="secondary" size="sm">
          {strategies.filter((s) => s.status === "connected").length}/
          {strategies.length} live
        </Badge>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Model</th>
              <th className="px-4 py-3 text-left font-medium">Pair</th>
              <th className="px-4 py-3 text-right font-medium">Direction</th>
              <th className="px-4 py-3 text-right font-medium">Leverage</th>
              <th className="px-4 py-3 text-right font-medium">Trades</th>
              <th className="px-4 py-3 text-right font-medium">Win%</th>
              <th className="px-4 py-3 text-right font-medium">PnL</th>
              <th className="px-4 py-3 text-right font-medium">Max DD</th>
              <th className="px-4 py-3 text-right font-medium">Last Signal</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {strategies.map((s) => (
              <Link
                key={s.name}
                href={`/strategies/${s.name}`}
                className="contents"
              >
                <tr className="hover:bg-muted/30 cursor-pointer transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${STATUS_DOT[s.status]}`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {STATUS_LABEL[s.status]}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono font-medium">
                    {s.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {s.model}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" size="sm">
                      {s.trade_pair}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Badge
                      variant={
                        s.direction === "LONG"
                          ? "primary"
                          : s.direction === "SHORT"
                          ? "destructive"
                          : "secondary"
                      }
                      size="sm"
                    >
                      {s.direction}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    {s.leverage.toFixed(2)}×
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    {s.total_trades}
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    {(s.win_rate * 100).toFixed(0)}%
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-mono ${
                      s.total_pnl >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {s.total_pnl >= 0 ? "+" : ""}
                    {formatPct(s.total_pnl)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-red-400">
                    {formatPct(s.max_drawdown)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground text-xs">
                    {formatAge(s.last_signal_ts)}
                  </td>
                </tr>
              </Link>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
