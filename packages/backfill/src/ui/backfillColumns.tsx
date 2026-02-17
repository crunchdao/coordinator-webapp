"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@crunch-ui/core";
import { BackfillJob, BackfillFile } from "../domain/types";

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

export function JobStatusBadge({ status }: { status: string }) {
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

export const jobColumns: ColumnDef<BackfillJob>[] = [
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

function buildFilePath(file: BackfillFile): string {
  return (
    file.path ||
    [file.source, file.subject, file.kind, file.granularity, file.filename]
      .filter(Boolean)
      .join("/")
  );
}

export function createFileColumns(
  buildDownloadUrl: (path: string) => string
): ColumnDef<BackfillFile>[] {
  return [
    {
      id: "path",
      header: "File",
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          {buildFilePath(row.original)}
        </span>
      ),
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
      cell: ({ row }) => (
        <a
          href={buildDownloadUrl(buildFilePath(row.original))}
          download
          className="text-xs text-primary underline"
        >
          Download
        </a>
      ),
    },
  ];
}
