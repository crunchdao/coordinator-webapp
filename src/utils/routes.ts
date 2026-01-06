import { Environment } from "./config";

export const INTERNAL_LINKS = {
  ROOT: "/",
  LOGIN: "/login",
  LEADERBOARD: "/leaderboard",
  METRICS: "/metrics",
  SETTINGS: "/settings",
  LOGS: "/logs",
  PITCH: "/pitch",
  MODELS: "/models",
  REGISTER: "/register",
  MAINTENANCE: "/maintenance",
} as const;

type RouteConfig = {
  path: string;
  label: string;
  allowedEnvs?: Environment[];
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
    allowedEnvs: ["production", "staging", "development"],
  },
  {
    path: INTERNAL_LINKS.LOGS,
    label: "Logs",
    allowedEnvs: ["local"],
  },
  {
    path: INTERNAL_LINKS.MODELS,
    label: "Models",
    allowedEnvs: ["local", "development"],
  },
  {
    path: INTERNAL_LINKS.SETTINGS,
    label: "Settings",
    allowedEnvs: ["local", "development"],
  },
];

export const isRouteAllowed = (path: string, env: Environment): boolean => {
  const route = ROUTE_CONFIG.find((r) => r.path === path);
  if (!route) return true;
  return route.allowedEnvs ? route.allowedEnvs.includes(env) : true;
};

export const getVisibleRoutes = (env: Environment): RouteConfig[] => {
  return ROUTE_CONFIG.filter((route) =>
    route.allowedEnvs ? route.allowedEnvs.includes(env) : true
  );
};
