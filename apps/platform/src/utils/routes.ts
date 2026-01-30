export const INTERNAL_LINKS = {
  ROOT: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  CREATE_CRUNCH: "/create-crunch",
  CERTIFICATE_ENROLL: "/certificate-enrollment",
  LEADERBOARD: "/:crunchname/leaderboard",
  METRICS: "/:crunchname/metrics",
  SETTINGS: "/:crunchname/settings",
  PITCH: "/:crunchname/pitch",
  REGISTER: "/register",
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
    path: INTERNAL_LINKS.PITCH,
    label: "Pitch",
  },
];
