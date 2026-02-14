export const INTERNAL_LINKS = {
  ROOT: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  ONBOARDING: "/onboarding",
  CREATE_CRUNCH: "/create-crunch",
  CERTIFICATE_ENROLL: "/certificate-enrollment",
  CRUNCH_OVERVIEW: "/:crunchname",
  MODELS: "/:crunchname/models",
  FEEDS: "/:crunchname/feeds",
  BACKFILL: "/:crunchname/backfill",
  CHECKPOINTS: "/:crunchname/checkpoints",
  CHECKPOINT_CREATE: "/:crunchname/create-checkpoint",
  LEADERBOARD: "/:crunchname/leaderboard",
  METRICS: "/:crunchname/metrics",
  SETTINGS: "/:crunchname/settings",
  PITCH: "/:crunchname/pitch",
} as const;

export const PAGE_LABELS: Record<string, string> = {
  onboarding: "Get Started",
  dashboard: "Dashboard",
  "create-crunch": "Create Crunch",
  "certificate-enrollment": "Certificate",
};

type RouteConfig = {
  path: string;
  label: string;
};

export const ROUTE_CONFIG: RouteConfig[] = [
  {
    path: INTERNAL_LINKS.CRUNCH_OVERVIEW,
    label: "Overview",
  },
  {
    path: INTERNAL_LINKS.MODELS,
    label: "Models",
  },
  {
    path: INTERNAL_LINKS.FEEDS,
    label: "Feeds",
  },
  {
    path: INTERNAL_LINKS.BACKFILL,
    label: "Backfill",
  },
  {
    path: INTERNAL_LINKS.CHECKPOINTS,
    label: "Checkpoints",
  },
  {
    path: INTERNAL_LINKS.LEADERBOARD,
    label: "Leaderboard",
  },
  {
    path: INTERNAL_LINKS.METRICS,
    label: "Metrics",
  },
  {
    path: INTERNAL_LINKS.PITCH,
    label: "Pitch",
  },
];
