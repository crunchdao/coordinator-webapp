export const INTERNAL_LINKS = {
  ROOT: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  ONBOARDING: "/onboarding",
  CREATE_CRUNCH: "/create-crunch",
  CERTIFICATE_ENROLL: "/certificate-enrollment",
  CRUNCH_OVERVIEW: "/:crunchname",
  CHECKPOINT: "/:crunchname/checkpoint",
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
