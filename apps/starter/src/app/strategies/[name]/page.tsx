"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@crunch-ui/core";
import {
  Chart,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "chartjs-adapter-date-fns";

Chart.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

// ── Types ────────────────────────────────────────────────────────────────

interface StrategyDetail {
  name: string;
  model: string;
  trade_pair: string;
  status: string;
  direction: string;
  leverage: number;
  entry_price: number;
  total_trades: number;
  winning_trades: number;
  win_rate: number;
  total_pnl: number;
  peak_pnl: number;
  max_drawdown: number;
  avg_win: number;
  avg_loss: number;
  profit_factor: number;
  avg_hold_seconds: number;
  trades_today: number;
  pnl_today: number;
  last_signal_ts: number;
  last_price: number;
}

interface Trade {
  ts: number;
  closed_direction: string;
  entry_price: number;
  exit_price: number;
  leverage: number;
  return: number;
  pnl: number;
  cumulative_pnl: number;
  hold_seconds: number;
}

interface Candle {
  ts: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// ── Helpers ──────────────────────────────────────────────────────────────

const STATUS_DOT: Record<string, string> = {
  connected: "bg-green-500",
  stale: "bg-yellow-500",
  offline: "bg-red-500",
};

function formatPct(val: number): string {
  return (val * 100).toFixed(2) + "%";
}

function formatDuration(seconds: number): string {
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400)
    return `${Math.floor(seconds / 3600)}h${Math.floor((seconds % 3600) / 60)}m`;
  return `${Math.floor(seconds / 86400)}d${Math.floor((seconds % 86400) / 3600)}h`;
}

function formatTime(ts: number): string {
  return new Date(ts * 1000).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(val: number): string {
  return val.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ── Stat Card ────────────────────────────────────────────────────────────

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

// ── Candlestick Chart (OHLC as bars + line) ──────────────────────────────

function CandlestickChart({
  candles,
  trades,
  interval,
  onIntervalChange,
}: {
  candles: Candle[];
  trades: Trade[];
  interval: string;
  onIntervalChange: (i: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || candles.length === 0) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d")!;
    const labels = candles.map((c) => new Date(c.ts * 1000));
    const closes = candles.map((c) => c.close);

    // Color bars by direction
    const barColors = candles.map((c) =>
      c.close >= c.open ? "rgba(34,197,94,0.6)" : "rgba(239,68,68,0.6)"
    );

    // High-low as error bars approximation: use bar from low to high
    const highs = candles.map((c) => c.high);
    const lows = candles.map((c) => c.low);

    // Trade markers on the price chart
    const buyPoints: { x: Date; y: number }[] = [];
    const sellPoints: { x: Date; y: number }[] = [];
    for (const t of trades) {
      const tradeDate = new Date(t.ts * 1000);
      // Match to nearest candle
      if (t.closed_direction === "LONG") {
        // Closed a long = sold
        sellPoints.push({ x: tradeDate, y: t.exit_price });
      } else if (t.closed_direction === "SHORT") {
        // Closed a short = bought
        buyPoints.push({ x: tradeDate, y: t.exit_price });
      }
    }

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            type: "line" as const,
            label: "Close",
            data: closes,
            borderColor: "rgba(148,163,184,0.8)",
            borderWidth: 1.5,
            pointRadius: 0,
            tension: 0.1,
            yAxisID: "y",
            order: 1,
          },
          {
            type: "bar" as const,
            label: "OHLC",
            data: candles.map((c) => ({
              x: new Date(c.ts * 1000).getTime(),
              y: [Math.min(c.open, c.close), Math.max(c.open, c.close)],
            })) as any,
            backgroundColor: barColors,
            borderColor: barColors,
            borderWidth: 1,
            yAxisID: "y",
            order: 2,
          },
          {
            type: "scatter" as const,
            label: "Buy",
            data: buyPoints,
            backgroundColor: "rgba(34,197,94,1)",
            borderColor: "white",
            borderWidth: 1.5,
            pointStyle: "triangle",
            pointRadius: 8,
            yAxisID: "y",
            order: 0,
          },
          {
            type: "scatter" as const,
            label: "Sell",
            data: sellPoints,
            backgroundColor: "rgba(239,68,68,1)",
            borderColor: "white",
            borderWidth: 1.5,
            pointStyle: "triangle",
            pointRadius: 8,
            yAxisID: "y",
            order: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: true, position: "top", labels: { usePointStyle: true, boxWidth: 8 } },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                if (ctx.dataset.label === "OHLC") {
                  const c = candles[ctx.dataIndex];
                  if (!c) return "";
                  return `O:${formatPrice(c.open)} H:${formatPrice(c.high)} L:${formatPrice(c.low)} C:${formatPrice(c.close)}`;
                }
                return `${ctx.dataset.label}: $${formatPrice(ctx.parsed.y ?? 0)}`;
              },
            },
          },
        },
        scales: {
          x: {
            type: "time",
            time: { unit: interval === "1d" ? "week" : interval === "4h" ? "day" : "hour" },
            grid: { color: "rgba(148,163,184,0.1)" },
            ticks: { color: "rgba(148,163,184,0.6)" },
          },
          y: {
            position: "right",
            grid: { color: "rgba(148,163,184,0.1)" },
            ticks: {
              color: "rgba(148,163,184,0.6)",
              callback: (val) => "$" + Number(val).toLocaleString(),
            },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [candles, trades, interval]);

  const intervals = ["1h", "4h", "1d"];

  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Price Chart
        </h3>
        <div className="flex gap-1">
          {intervals.map((i) => (
            <button
              key={i}
              onClick={() => onIntervalChange(i)}
              className={`px-3 py-1 text-xs rounded font-mono ${
                interval === i
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {i.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="h-80">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

// ── PnL Chart ────────────────────────────────────────────────────────────

function PnlChart({ trades }: { trades: Trade[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || trades.length === 0) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d")!;
    // Trades are most-recent-first from API, reverse for chronological
    const chronological = [...trades].reverse();
    const labels = chronological.map((t) => new Date(t.ts * 1000));
    const pnl = chronological.map((t) => t.cumulative_pnl * 100);

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Cumulative PnL (%)",
            data: pnl,
            borderColor: pnl[pnl.length - 1] >= 0 ? "rgb(34,197,94)" : "rgb(239,68,68)",
            backgroundColor: pnl[pnl.length - 1] >= 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            fill: true,
            tension: 0.3,
            pointRadius: 2,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => { const y = ctx.parsed.y ?? 0; return `PnL: ${y >= 0 ? "+" : ""}${y.toFixed(4)}%`; },
            },
          },
        },
        scales: {
          x: {
            type: "time",
            grid: { color: "rgba(148,163,184,0.1)" },
            ticks: { color: "rgba(148,163,184,0.6)" },
          },
          y: {
            grid: { color: "rgba(148,163,184,0.1)" },
            ticks: {
              color: "rgba(148,163,184,0.6)",
              callback: (val) => `${Number(val) >= 0 ? "+" : ""}${Number(val).toFixed(2)}%`,
            },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [trades]);

  return (
    <div className="border rounded-lg p-4 bg-card">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
        Cumulative PnL
      </h3>
      <div className="h-48">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

// ── Trade Log Table ──────────────────────────────────────────────────────

function TradeLog({ trades }: { trades: Trade[] }) {
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
        <table className="w-full text-sm">
          <thead className="bg-muted/30 sticky top-0">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Time</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Dir</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">Lev</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">Entry</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">Exit</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">Return</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">PnL</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">Cumul</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">Hold</th>
            </tr>
          </thead>
          <tbody className="divide-y font-mono text-xs">
            {trades.map((t, i) => (
              <tr key={i} className="hover:bg-muted/20">
                <td className="px-3 py-2 text-muted-foreground">
                  {formatTime(t.ts)}
                </td>
                <td className="px-3 py-2">
                  <Badge
                    variant={t.closed_direction === "LONG" ? "primary" : "destructive"}
                    size="sm"
                  >
                    {t.closed_direction}
                  </Badge>
                </td>
                <td className="px-3 py-2 text-right">{t.leverage.toFixed(2)}×</td>
                <td className="px-3 py-2 text-right">${formatPrice(t.entry_price)}</td>
                <td className="px-3 py-2 text-right">${formatPrice(t.exit_price)}</td>
                <td
                  className={`px-3 py-2 text-right ${
                    t.return >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {t.return >= 0 ? "+" : ""}
                  {formatPct(t.return)}
                </td>
                <td
                  className={`px-3 py-2 text-right ${
                    t.pnl >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {t.pnl >= 0 ? "+" : ""}
                  {formatPct(t.pnl)}
                </td>
                <td
                  className={`px-3 py-2 text-right ${
                    t.cumulative_pnl >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {t.cumulative_pnl >= 0 ? "+" : ""}
                  {formatPct(t.cumulative_pnl)}
                </td>
                <td className="px-3 py-2 text-right text-muted-foreground">
                  {formatDuration(t.hold_seconds)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────

export default function StrategyDetailPage() {
  const params = useParams();
  const name = params.name as string;

  const [detail, setDetail] = useState<StrategyDetail | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [interval, setInterval_] = useState("1h");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [detailRes, tradesRes] = await Promise.all([
        fetch(`/api/strategies/${name}`),
        fetch(`/api/strategies/${name}/trades?limit=500`),
      ]);
      if (!detailRes.ok) throw new Error(`Detail: HTTP ${detailRes.status}`);
      if (!tradesRes.ok) throw new Error(`Trades: HTTP ${tradesRes.status}`);
      setDetail(await detailRes.json());
      const tradesData = await tradesRes.json();
      setTrades(tradesData.trades || []);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [name]);

  const fetchCandles = useCallback(async () => {
    try {
      const limit = interval === "1d" ? 90 : interval === "4h" ? 168 : 168;
      const res = await fetch(
        `/api/strategies/${name}/candles?interval=${interval}&limit=${limit}`
      );
      if (!res.ok) throw new Error(`Candles: HTTP ${res.status}`);
      setCandles(await res.json());
    } catch (e: any) {
      console.error("Candle fetch error:", e);
    }
  }, [name, interval]);

  useEffect(() => {
    fetchData();
    const iv = window.setInterval(fetchData, 30000);
    return () => clearInterval(iv);
  }, [fetchData]);

  useEffect(() => {
    fetchCandles();
  }, [fetchCandles]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="text-destructive p-4">
        Error: {error || "Strategy not found"}
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
            <span className="font-mono">@ {detail.leverage.toFixed(2)}×</span>
            <span>
              entry ${formatPrice(detail.entry_price)}
            </span>
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
          color={detail.profit_factor >= 1 ? "text-green-500" : "text-red-500"}
        />
      </div>

      {/* Candlestick chart */}
      <CandlestickChart
        candles={candles}
        trades={trades}
        interval={interval}
        onIntervalChange={setInterval_}
      />

      {/* PnL chart */}
      <PnlChart trades={trades} />

      {/* Trade log */}
      <TradeLog trades={trades} />
    </div>
  );
}
