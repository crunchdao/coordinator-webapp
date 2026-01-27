import { LeaderboardColumn } from "./types";

export const FIXED_COLUMNS_DEFAULTS = {
  MODEL: {
    type: "MODEL" as const,
    displayName: "Model",
    order: 0,
    format: null,
    tooltip: null,
    nativeConfiguration: {
      type: "model" as const,
      statusProperty: "status",
    },
  },
  USERNAME: {
    type: "USERNAME" as const,
    displayName: "Username",
    order: -10,
    format: null,
    tooltip: null,
    nativeConfiguration: null,
  },
};

export const initialColumns: LeaderboardColumn[] = [
  {
    id: 1,
    ...FIXED_COLUMNS_DEFAULTS.MODEL,
    property: "model_id",
  },
  {
    id: 2,
    type: "VALUE",
    property: "score_recent",
    format: "decimal-2",
    displayName: "Recent Score",
    tooltip: "The score of the player over the last 24 hours.",
    nativeConfiguration: null,
    order: 20,
  },
  {
    id: 3,
    type: "VALUE",
    property: "score_steady",
    format: "decimal-2",
    displayName: "Steady Score",
    tooltip: "The score of the player over the last 72 hours.",
    nativeConfiguration: null,
    order: 30,
  },
  {
    id: 4,
    type: "VALUE",
    property: "score_anchor",
    format: "decimal-2",
    displayName: "Anchor Score",
    tooltip: "The score of the player over the last 7 days.",
    nativeConfiguration: null,
    order: 40,
  },
];
