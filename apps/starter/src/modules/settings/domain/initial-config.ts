import { GlobalSettings } from "./types";

export const initialSettings: GlobalSettings = {
  endpoints: {
    leaderboard: "/reports/leaderboard",
    models: "/reports/models",
  },
  logs: {
    containerNames: [
      "vanta-score-worker",
      "vanta-predict-worker",
      "vanta-report-worker",
      "model-orchestrator",
    ],
  },
};
