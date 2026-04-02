export const INTERNAL_LINKS = {
  ROOT: "/",
  LEADERBOARD: "/leaderboard",
  EVENTS: "/events",
} as const;

export type RouteConfig = {
  path: string;
  label: string;
};

export const ROUTE_CONFIG: RouteConfig[] = [
  {
    path: INTERNAL_LINKS.LEADERBOARD,
    label: "Leaderboard",
  },
  {
    path: INTERNAL_LINKS.EVENTS,
    label: "Events",
  },
];
