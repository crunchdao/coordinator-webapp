export type FeedSummary = {
  source: string;
  subject: string;
  kind: string;
  granularity: string;
  record_count: number;
  oldest_ts: string | null;
  newest_ts: string | null;
  watermark_ts: string | null;
  watermark_updated_at: string | null;
};

export type FeedTailRecord = {
  source: string;
  subject: string;
  kind: string;
  granularity: string;
  ts_event: string;
  ts_ingested: string;
  values: Record<string, unknown>;
  meta: Record<string, unknown>;
};
