export const endpoints = {
  getBackfillFeeds: () => "/reports/backfill/feeds",
  startBackfill: () => "/reports/backfill",
  getBackfillJobs: () => "/reports/backfill/jobs",
  getBackfillJob: (id: string) => `/reports/backfill/jobs/${id}`,
  getBackfillIndex: () => "/data/backfill/index",
};
