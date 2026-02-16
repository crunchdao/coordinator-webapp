"use client";

import { useEffect, useRef } from "react";
import { Chart, Tooltip, Legend, Filler } from "chart.js";
import { Trade } from "../domain/types";

export function PnlChart({ trades }: { trades: Trade[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || trades.length === 0) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d")!;
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
            borderColor:
              pnl[pnl.length - 1] >= 0
                ? "rgb(34,197,94)"
                : "rgb(239,68,68)",
            backgroundColor:
              pnl[pnl.length - 1] >= 0
                ? "rgba(34,197,94,0.1)"
                : "rgba(239,68,68,0.1)",
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
              label: (ctx) => {
                const y = ctx.parsed.y ?? 0;
                return `PnL: ${y >= 0 ? "+" : ""}${y.toFixed(4)}%`;
              },
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
              callback: (val) =>
                `${Number(val) >= 0 ? "+" : ""}${Number(val).toFixed(2)}%`,
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
