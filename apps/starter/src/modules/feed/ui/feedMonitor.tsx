"use client";

import { useEffect, useMemo, useState } from "react";
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
} from "@crunch-ui/core";
import { cn } from "@crunch-ui/utils";
import { useGetFeeds } from "../application/hooks/useGetFeeds";
import { useGetFeedTail } from "../application/hooks/useGetFeedTail";

/** Minimum poll interval — never poll faster than this. */
const MIN_POLL_MS = 5_000;

export const FeedMonitor: React.FC = () => {
  const [paused, setPaused] = useState(false);

  // ── Derive poll intervals from feed granularity ───────────────────
  // First fetch uses the feeds list to figure out the right cadence.
  // We do an initial fetch without polling, then enable polling once
  // we know the granularity.
  const feedsInitial = useGetFeeds(false);

  const minGranularitySec = useMemo(() => {
    if (feedsInitial.feeds.length === 0) return null;
    return Math.min(
      ...feedsInitial.feeds.map((f) => parseGranularitySeconds(f.granularity))
    );
  }, [feedsInitial.feeds]);

  const feedsPollMs = useMemo(() => {
    if (paused || minGranularitySec === null) return false as const;
    return Math.max(MIN_POLL_MS, minGranularitySec * 1000);
  }, [paused, minGranularitySec]);

  // Once we know the interval, this hook takes over (first result is
  // already cached by the initial fetch via the same query key).
  const { feeds, feedsLoading, feedsRefetching } = useGetFeeds(feedsPollMs);

  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    if (selectedKey) return;
    if (feeds.length === 0) return;
    setSelectedKey(feedKey(feeds[0]));
  }, [feeds, selectedKey]);

  const selectedFeed = useMemo(
    () => feeds.find((feed) => feedKey(feed) === selectedKey),
    [feeds, selectedKey]
  );

  const tailPollMs = useMemo(() => {
    if (paused || !selectedFeed) return false as const;
    const sec = parseGranularitySeconds(selectedFeed.granularity);
    return Math.max(MIN_POLL_MS, sec * 1000);
  }, [paused, selectedFeed]);

  const { records, recordsLoading, recordsRefetching } = useGetFeedTail(
    {
      provider: selectedFeed?.provider,
      asset: selectedFeed?.asset,
      kind: selectedFeed?.kind,
      granularity: selectedFeed?.granularity,
      limit: 20,
    },
    !!selectedFeed,
    tailPollMs
  );

  const isRefetching = feedsRefetching || recordsRefetching;
  const pollLabel = feedsPollMs
    ? formatInterval(feedsPollMs)
    : null;
  const tailPollLabel = tailPollMs
    ? formatInterval(tailPollMs)
    : null;

  return (
    <div className="grid gap-6">
      <Card displayCorners>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle>Feed Indexing</CardTitle>
              {!paused && pollLabel && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span
                    className={cn(
                      "inline-block h-2 w-2 rounded-full",
                      isRefetching
                        ? "bg-green-500 animate-pulse"
                        : "bg-green-500"
                    )}
                  />
                  <span>Live · every {pollLabel}</span>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPaused((p) => !p)}
            >
              {paused ? "▶ Resume" : "⏸ Pause"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Feed</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Oldest</TableHead>
                <TableHead>Newest</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedsLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    <div className="inline-flex items-center gap-2">
                      <Spinner />
                      <span>Loading feed index...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : feeds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No feed data indexed yet.
                  </TableCell>
                </TableRow>
              ) : (
                feeds.map((feed) => {
                  const key = feedKey(feed);
                  const isSelected = key === selectedKey;
                  const up = isFeedUp(feed.watermark_ts, feed.granularity);

                  return (
                    <TableRow
                      key={key}
                      className={cn("cursor-pointer", isSelected && "bg-muted/50")}
                      onClick={() => setSelectedKey(key)}
                    >
                      <TableCell>
                        <Badge
                          size="sm"
                          variant="secondary"
                          className={cn(
                            up && "text-green-600 dark:text-green-400"
                          )}
                        >
                          {up ? "Up" : "Stale"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {feed.provider}:{feed.asset}:{feed.kind}:{feed.granularity}
                      </TableCell>
                      <TableCell>{feed.record_count.toLocaleString()}</TableCell>
                      <TableCell>{feed.oldest_ts ? formatDate(feed.oldest_ts) : "-"}</TableCell>
                      <TableCell>{feed.newest_ts ? formatDate(feed.newest_ts) : "-"}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card displayCorners>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Latest Records (tail 20)</CardTitle>
            {!paused && selectedFeed && records.length > 0 && tailPollLabel && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className={cn(
                    "inline-block h-2 w-2 rounded-full",
                    recordsRefetching
                      ? "bg-green-500 animate-pulse"
                      : "bg-green-500"
                  )}
                />
                <span>Polling every {tailPollLabel}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!selectedFeed ? (
            <p className="text-muted-foreground">Pick a feed row to inspect latest records.</p>
          ) : recordsLoading ? (
            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <Spinner />
              <span>Loading records...</span>
            </div>
          ) : records.length === 0 ? (
            <p className="text-muted-foreground">No records available for this feed yet.</p>
          ) : (
            <div className="space-y-2">
              {records.map((record, idx) => (
                <pre
                  key={`${record.provider}-${record.asset}-${record.ts_event}-${idx}`}
                  className="text-xs p-3 rounded-md bg-muted overflow-x-auto"
                >
                  {JSON.stringify(
                    {
                      ts_event: record.ts_event,
                      ts_ingested: record.ts_ingested,
                      values: record.values,
                      meta: record.meta,
                    },
                    null,
                    2
                  )}
                </pre>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ── Helpers ──────────────────────────────────────────────────────────

function feedKey(feed: {
  provider: string;
  asset: string;
  kind: string;
  granularity: string;
}) {
  return [feed.provider, feed.asset, feed.kind, feed.granularity].join(":");
}

function isFeedUp(watermarkTs: string | null, granularity: string) {
  if (!watermarkTs) return false;
  const ts = Date.parse(watermarkTs);
  if (Number.isNaN(ts)) return false;

  const granularitySeconds = parseGranularitySeconds(granularity);
  const staleAfterSeconds = Math.max(120, granularitySeconds * 6);

  return Date.now() - ts < staleAfterSeconds * 1000;
}

function parseGranularitySeconds(granularity: string): number {
  const cleaned = granularity.trim().toLowerCase();
  if (cleaned.endsWith("s")) {
    return Number(cleaned.slice(0, -1)) || 1;
  }
  if (cleaned.endsWith("m")) {
    return (Number(cleaned.slice(0, -1)) || 1) * 60;
  }
  if (cleaned.endsWith("h")) {
    return (Number(cleaned.slice(0, -1)) || 1) * 3600;
  }
  return 60;
}

function formatInterval(ms: number): string {
  const sec = ms / 1000;
  if (sec < 60) return `${sec}s`;
  const min = sec / 60;
  if (Number.isInteger(min)) return `${min}m`;
  return `${sec}s`;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}
