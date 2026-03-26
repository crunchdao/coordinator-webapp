"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Spinner,
} from "@crunch-ui/core";
import { Search } from "@crunch-ui/icons";
import { cn } from "@crunch-ui/utils";
import { useGetPoolRankings } from "@/modules/leaderboard/application/hooks/useGetPoolRankings";
import type { PoolModelRanking } from "@/modules/leaderboard/infrastructure/poolServices";

function formatBrier(value: number): string {
  return value.toFixed(4);
}

function formatPnl(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(4)}`;
}

export default function LeaderboardPage() {
  const { data, loading } = useGetPoolRankings();
  const [selectedPool, setSelectedPool] = useState("global");
  const [searchTerm, setSearchTerm] = useState("");

  const pools = data?.pools ?? [];
  const poolNames = pools.map((p) => p.pool);

  const currentPool = pools.find((p) => p.pool === selectedPool);
  const isPnl = currentPool?.metric === "pnl";

  const rankings = useMemo(() => {
    if (!currentPool) return [];
    if (!searchTerm) return currentPool.rankings;
    const term = searchTerm.toLowerCase();
    return currentPool.rankings.filter(
      (r) =>
        r.model_name.toLowerCase().includes(term) ||
        r.model_id.toLowerCase().includes(term)
    );
  }, [currentPool, searchTerm]);

  const totalModels = currentPool?.rankings.length ?? 0;
  const bestBrier = currentPool?.rankings[0]?.avg_brier;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Active Models</div>
            <div className="text-2xl font-mono font-bold">{totalModels}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">
              {isPnl ? "Best PnL" : "Best Brier"}
            </div>
            <div className="text-2xl font-mono font-bold">
              {bestBrier !== undefined
                ? isPnl
                  ? formatPnl(currentPool!.rankings[0].avg_pnl)
                  : formatBrier(bestBrier)
                : "\u2014"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card displayCorners>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Leaderboard</CardTitle>
            <div className="flex items-center gap-3">
              <Select value={selectedPool} onValueChange={setSelectedPool}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {poolNames.map((name) => {
                    const pool = pools.find((p) => p.pool === name);
                    const label = `${name.charAt(0).toUpperCase() + name.slice(1)} (${pool?.metric === "pnl" ? "PnL" : "Brier"})`;
                    return (
                      <SelectItem key={name} value={name}>
                        {label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter by model..."
                className="max-w-xs"
                clearable
                rightSlot={<Search className="text-muted-foreground" />}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : rankings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No rankings available for this pool.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">Rank</th>
                    <th className="pb-3 pr-4 font-medium">Model</th>
                    <th className="pb-3 pr-4 font-medium text-right">Events</th>
                    <th className="pb-3 pr-4 font-medium text-right">
                      {isPnl ? "Avg PnL" : "Avg Brier"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((r) => (
                    <tr
                      key={r.model_id}
                      className="border-b last:border-0 hover:bg-muted/50"
                    >
                      <td className="py-3 pr-4 font-mono">{r.rank}</td>
                      <td className="py-3 pr-4">
                        <div>
                          <span className="font-medium">{r.model_name}</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            {r.model_id.slice(0, 8)}\u2026
                          </span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-right font-mono">
                        {r.events_scored}
                      </td>
                      <td
                        className={cn(
                          "py-3 pr-4 text-right font-mono",
                          isPnl && r.avg_pnl > 0 && "text-green-600",
                          isPnl && r.avg_pnl < 0 && "text-red-600"
                        )}
                      >
                        {isPnl ? formatPnl(r.avg_pnl) : formatBrier(r.avg_brier)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
