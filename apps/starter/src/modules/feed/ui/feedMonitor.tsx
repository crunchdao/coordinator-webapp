"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Badge,
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
} from "@crunch-ui/core";
import { DataTable } from "@coordinator/ui/src/data-table";
import { useGetFeeds } from "../application/hooks/useGetFeeds";
import { useGetFeedTail } from "../application/hooks/useGetFeedTail";
import { FeedSummary, FeedTailRecord } from "../domain/types";

function timeAgo(isoDate: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(isoDate).getTime()) / 1000
  );
  if (seconds < 0) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString();
}

const feedSummaryColumns: ColumnDef<FeedSummary>[] = [
  { accessorKey: "source", header: "Source" },
  { accessorKey: "subject", header: "Subject" },
  { accessorKey: "kind", header: "Kind" },
  { accessorKey: "granularity", header: "Granularity" },
  {
    accessorKey: "record_count",
    header: "Records",
    cell: ({ row }) => row.original.record_count.toLocaleString(),
  },
  {
    id: "freshness",
    header: "Last Data",
    cell: ({ row }) => {
      const ts = row.original.newest_ts;
      if (!ts) return <span className="text-muted-foreground">-</span>;
      const ageMs = Date.now() - new Date(ts).getTime();
      return (
        <Badge variant={ageMs / 1000 < 120 ? "success" : "warning"}>
          {timeAgo(ts)}
        </Badge>
      );
    },
  },
];

const feedRecordColumns: ColumnDef<FeedTailRecord>[] = [
  {
    id: "time",
    header: "Event Time",
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {formatTime(row.original.ts_event)}
      </span>
    ),
  },
  { accessorKey: "source", header: "Source" },
  { accessorKey: "subject", header: "Subject" },
  {
    id: "values",
    header: "Values",
    cell: ({ row }) => {
      const vals = row.original.values;
      return (
        <span className="font-mono text-xs">
          {Object.entries(vals)
            .map(([k, v]) => {
              const num = typeof v === "number" ? v : parseFloat(String(v));
              return `${k}: ${isNaN(num) ? v : num.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
            })
            .join(" · ")}
        </span>
      );
    },
  },
  {
    id: "latency",
    header: "Latency",
    cell: ({ row }) => {
      const event = new Date(row.original.ts_event).getTime();
      const ingested = new Date(row.original.ts_ingested).getTime();
      const ms = ingested - event;
      return <span className="text-xs">{ms}ms</span>;
    },
  },
];

export function FeedMonitor() {
  const { feeds, feedsLoading, feedsError } = useGetFeeds();
  const [selectedFeed, setSelectedFeed] = useState<string>("all");

  const feedFilter =
    selectedFeed !== "all"
      ? {
          source: selectedFeed.split("/")[0],
          subject: selectedFeed.split("/")[1],
          limit: 50,
        }
      : { limit: 50 };

  const { records, recordsLoading } = useGetFeedTail(feedFilter);

  if (feedsError) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Card displayCorners>
        <CardHeader>
          <CardTitle>Feed Sources</CardTitle>
          <CardDescription>
            Active data feeds powering the prediction pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={feedSummaryColumns}
            data={feeds}
            loading={feedsLoading}
          />
        </CardContent>
      </Card>

      <Card displayCorners>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Live Feed Data</CardTitle>
              <CardDescription>
                Most recent data points (auto-refreshes every 5s)
              </CardDescription>
            </div>
            {feeds.length > 1 && (
              <Select value={selectedFeed} onValueChange={setSelectedFeed}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All feeds</SelectItem>
                  {feeds.map((f) => (
                    <SelectItem
                      key={`${f.source}/${f.subject}`}
                      value={`${f.source}/${f.subject}`}
                    >
                      {f.source}/{f.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={feedRecordColumns}
            data={records}
            loading={recordsLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
