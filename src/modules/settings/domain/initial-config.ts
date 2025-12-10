import { GlobalSettings } from "./types";

export const initialSettings: GlobalSettings = {
  endpoints: {
    leaderboard: "/reports/leaderboard",
  },
  logs: {
    containerNames: [
      "condorgame-backend-score-worker-1",
      "condorgame-backend-predict-worker-1",
      "condorgame-backend-report-worker-1",
      "model-orchestrator-local",
    ],
  },
};
