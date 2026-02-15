"use client";

import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
} from "@crunch-ui/core";
import { DataTable } from "@coordinator/ui/src/data-table";
import { useBackfillFeeds } from "../application/hooks/useBackfillFeeds";
import { useBackfillJobs } from "../application/hooks/useBackfillJobs";
import { useStartBackfill } from "../application/hooks/useStartBackfill";
import { useBackfillIndex } from "../application/hooks/useBackfillIndex";
import { BackfillFeed, BackfillFile, BackfillJob } from "../domain/types";

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function feedLabel(feed: { source: string; subject: string; kind: string; granularity: string }) {
  return [feed.source, feed.subject, feed.kind, feed.granularity]
    .filter(Boolean)
    .join(" / ");
}

function feedKey(feed: BackfillFeed) {
  return `${feed.source}|${feed.subject}|${feed.kind}|${feed.granularity}`;
}

function JobStatusBadge({ status }: { status: string }) {
  const variant =
    status === "COMPLETED"
      ? "success"
      : status === "FAILED"
        ? "destructive"
        : "secondary";
  return (
    <Badge variant={variant} size="sm">
      {status}
    </Badge>
  );
}

function ProgressCell({ job }: { job: BackfillJob }) {
  if (job.status === "RUNNING") {
    const pct = job.progress_pct ?? 0;
    return (
      <div className="space-y-1 min-w-32">
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {pct.toFixed(0)}%
        </span>
      </div>
    );
  }
  if (job.status === "COMPLETED") {
    return <span className="text-xs text-muted-foreground">100%</span>;
  }
  if (job.error) {
    return (
      <span
        className="text-xs text-destructive truncate max-w-48 block"
        title={job.error}
      >
        {job.error}
      </span>
    );
  }
  return <span>-</span>;
}

const jobColumns: ColumnDef<BackfillJob>[] = [
  {
    accessorKey: "kind",
    header: "Kind",
  },
  {
    accessorKey: "granularity",
    header: "Granularity",
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => row.original.source || "-",
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => row.original.subject || "-",
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => <JobStatusBadge status={row.original.status} />,
  },
  {
    id: "progress",
    header: "Progress",
    cell: ({ row }) => <ProgressCell job={row.original} />,
  },
  {
    accessorKey: "records_written",
    header: "Records",
    cell: ({ row }) => row.original.records_written.toLocaleString(),
  },
  {
    accessorKey: "pages_fetched",
    header: "Pages",
  },
  {
    id: "created",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-xs">{formatDate(row.original.created_at)}</span>
    ),
  },
];

const fileColumns: ColumnDef<BackfillFile>[] = [
  {
    id: "path",
    header: "File",
    cell: ({ row }) => {
      const file = row.original;
      const filePath =
        file.path ||
        [file.source, file.subject, file.kind, file.granularity, file.filename]
          .filter(Boolean)
          .join("/");
      return <span className="font-mono text-xs">{filePath}</span>;
    },
  },
  {
    id: "size",
    header: "Size",
    cell: ({ row }) => {
      const bytes = row.original.size_bytes;
      return (
        <span className="text-xs">
          {bytes ? `${(bytes / 1024).toFixed(1)} KB` : "-"}
        </span>
      );
    },
  },
  {
    id: "download",
    header: "",
    cell: ({ row }) => {
      const file = row.original;
      const filePath =
        file.path ||
        [file.source, file.subject, file.kind, file.granularity, file.filename]
          .filter(Boolean)
          .join("/");
      return (
        <a
          href={`/api/data/backfill/${filePath}`}
          download
          className="text-xs text-primary underline"
        >
          Download
        </a>
      );
    },
  },
];

function StartBackfillCard({
  feeds,
  hasRunningJob,
}: {
  feeds: BackfillFeed[];
  hasRunningJob: boolean;
}) {
  const { startBackfill, startBackfillLoading } = useStartBackfill();
  const [selectedFeedKey, setSelectedFeedKey] = useState<string>("");

  const defaultEnd = new Date().toISOString().slice(0, 16);
  const defaultStart = new Date(Date.now() - 30 * 86400000)
    .toISOString()
    .slice(0, 16);
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  const selectedFeed = useMemo(
    () => feeds.find((f) => feedKey(f) === selectedFeedKey),
    [feeds, selectedFeedKey]
  );

  const handleStart = () => {
    if (!selectedFeed) return;
    startBackfill({
      source: selectedFeed.source,
      subject: selectedFeed.subject,
      kind: selectedFeed.kind,
      granularity: selectedFeed.granularity,
      start: new Date(startDate).toISOString(),
      end: new Date(endDate).toISOString(),
    });
  };

  const disabled = hasRunningJob || startBackfillLoading || !selectedFeed;

  return (
    <Card displayCorners>
      <CardHeader>
        <CardTitle>Start Backfill</CardTitle>
        <CardDescription>
          Export historical feed data to Parquet files
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Feed</Label>
            <Select value={selectedFeedKey} onValueChange={setSelectedFeedKey}>
              <SelectTrigger>
                <SelectValue placeholder="Select a feed..." />
              </SelectTrigger>
              <SelectContent>
                {feeds.map((feed) => {
                  const key = feedKey(feed);
                  return (
                    <SelectItem key={key} value={key}>
                      {feedLabel(feed)}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>Start</Label>
              <Input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>End</Label>
              <Input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <Button
            onClick={handleStart}
            disabled={disabled}
            loading={startBackfillLoading}
          >
            Start Backfill
          </Button>
          {hasRunningJob && (
            <span className="text-sm text-muted-foreground">
              A backfill job is already running
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function JobsCard({
  jobs,
  loading,
}: {
  jobs: BackfillJob[];
  loading: boolean;
}) {
  const sorted = useMemo(
    () =>
      [...jobs].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    [jobs]
  );

  return (
    <Card displayCorners>
      <CardHeader>
        <CardTitle>Backfill Jobs</CardTitle>
        <CardDescription>{sorted.length} job(s)</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={jobColumns} data={sorted} loading={loading} />
      </CardContent>
    </Card>
  );
}

function DataFilesCard() {
  const { files, filesLoading } = useBackfillIndex();

  if (filesLoading) {
    return (
      <Card displayCorners>
        <CardHeader>
          <CardTitle>Data Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (files.length === 0) return null;

  return (
    <Card displayCorners>
      <CardHeader>
        <CardTitle>Data Files</CardTitle>
        <CardDescription>
          {files.length} Parquet file(s) available for download
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={fileColumns} data={files} />
      </CardContent>
    </Card>
  );
}

export function BackfillManager() {
  const { feeds, feedsLoading } = useBackfillFeeds();
  const { jobs, jobsLoading, hasRunningJob } = useBackfillJobs();

  if (feedsLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StartBackfillCard feeds={feeds} hasRunningJob={hasRunningJob} />
      <JobsCard jobs={jobs} loading={jobsLoading} />
      <DataFilesCard />
    </div>
  );
}
