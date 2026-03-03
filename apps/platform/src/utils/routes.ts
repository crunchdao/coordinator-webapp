export const INTERNAL_LINKS = {
  ROOT: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  ONBOARDING: "/get-started",
  CREATE_CRUNCH: "/create-crunch",
  CERTIFICATE_ENROLL: "/certificate-enrollment",
  HUB_OAUTH: "/hub-oauth",
  COMPETITIONS: "/c",
  CRUNCH: "/c/:crunchname",
  CRUNCH_OVERVIEW: "/c/:crunchname/overview",
  MODELS: "/c/:crunchname/models",
  CHECKPOINTS: "/c/:crunchname/checkpoints",
  CHECKPOINT_CREATE: "/c/:crunchname/create-checkpoint",
  LEADERBOARD: "/c/:crunchname/leaderboard",
  METRICS: "/c/:crunchname/metrics",
  SETTINGS: "/c/:crunchname/settings",
  ENVIRONMENTS: "/c/:crunchname/environments",
  PITCH: "/c/:crunchname/pitch",
  ONCHAIN_EXPLORER: "/onchain-explorer",
} as const;

export const PAGE_LABELS: Record<string, string> = {
  "get-started": "Get Started",
  dashboard: "Dashboard",
  "create-crunch": "Create Crunch",
  "certificate-enrollment": "Certificate",
  c: "Crunches",
  "onchain-explorer": "Onchain Explorer",
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
    path: INTERNAL_LINKS.CHECKPOINTS,
    label: "Checkpoints",
  },
  {
    path: INTERNAL_LINKS.ENVIRONMENTS,
    label: "Environments",
  },
  {
    path: INTERNAL_LINKS.SETTINGS,
    label: "Settings",
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
