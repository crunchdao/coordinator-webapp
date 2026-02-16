"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Badge,
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

export const FeedMonitor: React.FC = () => {
  const { feeds, feedsLoading } = useGetFeeds();
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

  const { records, recordsLoading } = useGetFeedTail(
    {
      source: selectedFeed?.source,
      subject: selectedFeed?.subject,
      kind: selectedFeed?.kind,
      granularity: selectedFeed?.granularity,
      limit: 10,
    },
    !!selectedFeed
  );

  return (
    <div className="grid gap-6">
      <Card displayCorners>
        <CardHeader>
          <CardTitle>Feed Indexing</CardTitle>
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
                        {feed.source}:{feed.subject}:{feed.kind}:{feed.granularity}
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
          <CardTitle>Latest Records (tail 10)</CardTitle>
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
                  key={`${record.source}-${record.subject}-${record.ts_event}-${idx}`}
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

function feedKey(feed: {
  source: string;
  subject: string;
  kind: string;
  granularity: string;
}) {
  return [feed.source, feed.subject, feed.kind, feed.granularity].join(":");
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

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}
