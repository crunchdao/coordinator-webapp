"use client";

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@crunch-ui/core";
import { useNodeStatus } from "../application/hooks/useNodeStatus";

function timeAgo(isoDate: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(isoDate).getTime()) / 1000
  );
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function NodeStatusOverview() {
  const { nodeStatus, nodeStatusLoading, nodeStatusError } = useNodeStatus();

  if (nodeStatusError) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Node Status</CardTitle>
            <Badge variant="destructive">Offline</Badge>
          </div>
          <CardDescription>
            Could not connect to the coordinator node.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (nodeStatusLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  const { isOnline, models, feeds, snapshots, recentCheckpoints } = nodeStatus;

  const pendingCount = recentCheckpoints.filter(
    (c) => c.status === "PENDING"
  ).length;
  const totalCheckpoints = recentCheckpoints.length;

  const latestFeed = feeds.length > 0 ? feeds[0] : null;
  const latestSnapshot =
    snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Node Status</CardTitle>
          <Badge variant={isOnline ? "success" : "destructive"}>
            {isOnline ? "Online" : "Offline"}
          </Badge>
        </div>
        <CardDescription>
          Live status from the coordinator node
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <StatCard
            label="Models"
            value={models.length}
            sub={
              models.length > 0
                ? models.map((m) => m.model_name).join(", ")
                : "No models registered"
            }
          />

          <StatCard
            label="Feeds"
            value={feeds.length}
            sub={
              latestFeed
                ? `${latestFeed.source}/${latestFeed.subject} · ${latestFeed.record_count} records`
                : "No feeds"
            }
          />

          <StatCard
            label="Feed Freshness"
            value={latestFeed ? timeAgo(latestFeed.newest_ts) : "—"}
            sub={
              latestFeed
                ? `Last: ${new Date(latestFeed.newest_ts).toLocaleTimeString()}`
                : undefined
            }
          />

          <StatCard
            label="Snapshots"
            value={snapshots.length}
            sub={
              latestSnapshot
                ? `Latest: ${timeAgo(latestSnapshot.created_at)}`
                : "No snapshots yet"
            }
          />

          <StatCard
            label="Checkpoints"
            value={totalCheckpoints}
            sub={
              pendingCount > 0
                ? `${pendingCount} pending settlement`
                : "None pending"
            }
          />
        </div>

        {feeds.length > 1 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-2">All Feeds</p>
            <div className="flex flex-wrap gap-2">
              {feeds.map((feed) => (
                <Badge key={`${feed.source}-${feed.subject}`} variant="outline">
                  {feed.source}/{feed.subject} · {feed.kind} ·{" "}
                  {feed.record_count} records ·{" "}
                  {timeAgo(feed.newest_ts)}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
