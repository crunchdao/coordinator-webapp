"use client";

import { useMemo, useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@crunch-ui/core";
import { cn } from "@crunch-ui/utils";
import { useBackfillFeeds } from "../application/hooks/useBackfillFeeds";
import { useBackfillJobs } from "../application/hooks/useBackfillJobs";
import { useStartBackfill } from "../application/hooks/useStartBackfill";
import { useBackfillIndex } from "../application/hooks/useBackfillIndex";
import { BackfillFeed, BackfillJob } from "../domain/types";

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function feedKey(feed: BackfillFeed) {
  return `${feed.source}:${feed.subject}:${feed.kind}:${feed.granularity}`;
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

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="w-full bg-muted rounded-full h-2">
      <div
        className="bg-primary h-2 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
      />
    </div>
  );
}

function StartBackfillCard({
  feeds,
  hasRunningJob,
}: {
  feeds: BackfillFeed[];
  hasRunningJob: boolean;
}) {
  const { startBackfill, startBackfillLoading } = useStartBackfill();
  const [selectedFeedKey, setSelectedFeedKey] = useState<string>("");

  // Default date range: last 30 days
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
                      {key}
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

function JobsTable({ jobs, loading }: { jobs: BackfillJob[]; loading: boolean }) {
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
        <CardDescription>
          {sorted.length} job(s)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : sorted.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No backfill jobs yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Pages</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((job) => (
                <TableRow
                  key={job.id}
                  className={cn(
                    job.status === "RUNNING" && "bg-muted/30"
                  )}
                >
                  <TableCell className="font-mono text-xs">
                    {job.source}:{job.subject}:{job.kind}:{job.granularity}
                  </TableCell>
                  <TableCell>
                    <JobStatusBadge status={job.status} />
                  </TableCell>
                  <TableCell className="min-w-32">
                    {job.status === "RUNNING" ? (
                      <div className="space-y-1">
                        <ProgressBar pct={job.progress_pct ?? 0} />
                        <span className="text-xs text-muted-foreground">
                          {(job.progress_pct ?? 0).toFixed(0)}%
                        </span>
                      </div>
                    ) : job.status === "COMPLETED" ? (
                      <span className="text-xs text-muted-foreground">100%</span>
                    ) : job.error ? (
                      <span className="text-xs text-destructive truncate max-w-48 block" title={job.error}>
                        {job.error}
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>{job.records_written.toLocaleString()}</TableCell>
                  <TableCell>{job.pages_fetched}</TableCell>
                  <TableCell className="text-xs">
                    {formatDate(job.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File</TableHead>
              <TableHead>Size</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file, idx) => (
              <TableRow key={file.path || idx}>
                <TableCell className="font-mono text-xs">
                  {file.path || `${file.source}/${file.subject}/${file.kind}/${file.granularity}/${file.filename}`}
                </TableCell>
                <TableCell className="text-xs">
                  {file.size_bytes
                    ? `${(file.size_bytes / 1024).toFixed(1)} KB`
                    : "-"}
                </TableCell>
                <TableCell>
                  <a
                    href={`/api/data/backfill/${file.path || `${file.source}/${file.subject}/${file.kind}/${file.granularity}/${file.filename}`}`}
                    download
                    className="text-xs text-primary underline"
                  >
                    Download
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
      <JobsTable jobs={jobs} loading={jobsLoading} />
      <DataFilesCard />
    </div>
  );
}
