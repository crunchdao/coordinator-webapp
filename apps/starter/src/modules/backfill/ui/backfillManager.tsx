"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Spinner,
} from "@crunch-ui/core";
import { DataTable } from "@coordinator/ui/src/data-table";
import {
  jobColumns,
  createFileColumns,
  StartBackfillCard,
} from "@coordinator/backfill";
import type { BackfillJob } from "@coordinator/backfill";
import { useBackfillFeeds } from "../application/hooks/useBackfillFeeds";
import { useBackfillJobs } from "../application/hooks/useBackfillJobs";
import { useStartBackfill } from "../application/hooks/useStartBackfill";
import { useBackfillIndex } from "../application/hooks/useBackfillIndex";

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

  const fileColumns = useMemo(
    () => createFileColumns((filePath) => `/api/data/backfill/${filePath}`),
    []
  );

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
  const { startBackfill, startBackfillLoading } = useStartBackfill();

  if (feedsLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StartBackfillCard
        feeds={feeds}
        hasRunningJob={hasRunningJob}
        onStart={startBackfill}
        startLoading={startBackfillLoading}
      />
      <JobsCard jobs={jobs} loading={jobsLoading} />
      <DataFilesCard />
    </div>
  );
}
