export const INTERNAL_LINKS = {
  ROOT: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  LEADERBOARD: "/leaderboard",
  METRICS: "/metrics",
  SETTINGS: "/settings",
  MODELS: "/models",
  LOGS: "/logs",
  FEEDS: "/feeds",
  CHECKPOINTS: "/checkpoints",
  BACKFILL: "/backfill",
} as const;

export type RouteConfig = {
  path: string;
  label: string;
  /** When set, this route is only shown if the check returns true. */
  visibilityKey?: string;
};

export const ROUTE_CONFIG: RouteConfig[] = [
  {
    path: INTERNAL_LINKS.LEADERBOARD,
    label: "Leaderboard",
  },
  {
    path: INTERNAL_LINKS.METRICS,
    label: "Metrics",
  },
  {
    path: INTERNAL_LINKS.MODELS,
    label: "Models",
  },
  {
    path: INTERNAL_LINKS.LOGS,
    label: "Logs",
  },
  {
    path: INTERNAL_LINKS.FEEDS,
    label: "Feeds",
    visibilityKey: "feeds",
  },
  {
    path: INTERNAL_LINKS.CHECKPOINTS,
    label: "Checkpoints",
  },
  {
    path: INTERNAL_LINKS.BACKFILL,
    label: "Backfill",
    visibilityKey: "feeds",
  },
  {
    path: INTERNAL_LINKS.SETTINGS,
    label: "Settings",
  },
];
