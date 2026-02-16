"use client";

import { useEffect, useRef } from "react";
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
import { Candle, Trade } from "../domain/types";
import { formatPrice } from "./helpers";

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

interface CandlestickChartProps {
  candles: Candle[];
  trades: Trade[];
  interval: string;
  onIntervalChange: (i: string) => void;
}

const INTERVALS = ["1h", "4h", "1d"];

export function CandlestickChart({
  candles,
  trades,
  interval,
  onIntervalChange,
}: CandlestickChartProps) {
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
    const barColors = candles.map((c) =>
      c.close >= c.open ? "rgba(34,197,94,0.6)" : "rgba(239,68,68,0.6)"
    );

    const buyPoints: { x: Date; y: number }[] = [];
    const sellPoints: { x: Date; y: number }[] = [];
    for (const t of trades) {
      const tradeDate = new Date(t.ts * 1000);
      if (t.closed_direction === "LONG") {
        sellPoints.push({ x: tradeDate, y: t.exit_price });
      } else if (t.closed_direction === "SHORT") {
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
          legend: {
            display: true,
            position: "top",
            labels: { usePointStyle: true, boxWidth: 8 },
          },
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
            time: {
              unit:
                interval === "1d"
                  ? "week"
                  : interval === "4h"
                    ? "day"
                    : "hour",
            },
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

  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Price Chart
        </h3>
        <div className="flex gap-1">
          {INTERVALS.map((i) => (
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
