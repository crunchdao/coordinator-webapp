export const INTERNAL_LINKS = {
  ROOT: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  ONBOARDING: "/get-started",
  CREATE_CRUNCH: "/create-crunch",
  CERTIFICATE_ENROLL: "/certificate-enrollment",
  CRUNCH: "/c/:crunchname",
  CRUNCH_OVERVIEW: "/c/:crunchname/overview",
  MODELS: "/c/:crunchname/models",
  CHECKPOINTS: "/c/:crunchname/checkpoints",
  CHECKPOINT_CREATE: "/c/:crunchname/create-checkpoint",
  LEADERBOARD: "/c/:crunchname/leaderboard",
  METRICS: "/c/:crunchname/metrics",
  SETTINGS: "/c/:crunchname/settings",
  PITCH: "/c/:crunchname/pitch",
} as const;

export const PAGE_LABELS: Record<string, string> = {
  "get-started": "Get Started",
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
    path: INTERNAL_LINKS.CRUNCH,
    label: "General",
  },
  {
    path: INTERNAL_LINKS.CRUNCH_OVERVIEW,
    label: "Overview",
  },
  {
    path: INTERNAL_LINKS.MODELS,
    label: "Models",
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
