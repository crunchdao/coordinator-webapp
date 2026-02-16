export type BackfillJobStatus = "RUNNING" | "COMPLETED" | "FAILED";

export interface BackfillJob {
  id: string;
  source: string;
  subject: string;
  kind: string;
  granularity: string;
  start_ts: string;
  end_ts: string;
  cursor_ts: string | null;
  records_written: number;
  pages_fetched: number;
  status: BackfillJobStatus;
  error: string | null;
  created_at: string;
  updated_at: string;
  progress_pct?: number;
}

export interface BackfillFile {
  source: string;
  subject: string;
  kind: string;
  granularity: string;
  filename: string;
  size_bytes?: number;
  record_count?: number;
  path: string;
}

export interface BackfillFeed {
  source: string;
  subject: string;
  kind: string;
  granularity: string;
  record_count: number;
  oldest_ts: string | null;
  newest_ts: string | null;
}

export interface StartBackfillRequest {
  source: string;
  subject: string;
  kind: string;
  granularity: string;
  start: string;
  end: string;
}
