export const INTERNAL_LINKS = {
  ROOT: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  LEADERBOARD: "/leaderboard",
  METRICS: "/metrics",
  SETTINGS: "/settings",
  MODELS: "/models",
  LOGS: "/logs",
} as const;

type RouteConfig = {
  path: string;
  label: string;
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
    path: INTERNAL_LINKS.SETTINGS,
    label: "Settings",
  },
];
