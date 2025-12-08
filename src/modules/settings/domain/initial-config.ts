import { GlobalSettings } from "./types";

export const initialSettings: GlobalSettings = {
  apiBaseUrl: "http://localhost:8000",
  endpoints: {
    leaderboard: "/reports/leaderboard",
  },
};
