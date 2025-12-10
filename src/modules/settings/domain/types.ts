export interface GlobalSettings {
  apiBaseUrl: string;
  endpoints: {
    leaderboard: string;
  };
  logs: {
    containerNames: string[];
  };
}