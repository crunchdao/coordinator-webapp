import { GaugeConfiguration } from "@/modules/chart/domain/types";
import { z } from "zod";
import { 
  createLeaderboardSchema, 
  leaderboardColumnSchema, 
  formatTypeSchema,
  columnTypeSchema,
  leaderboardPositionSchema 
} from "../application/schemas/createLeaderboardSchema";

export type LeaderboardPosition = z.infer<typeof leaderboardPositionSchema>;

export type FormatType = z.infer<typeof formatTypeSchema>;

export type ColumnType = z.infer<typeof columnTypeSchema>;

export type LeaderboardColumn = z.infer<typeof leaderboardColumnSchema>;

export type Leaderboard = LeaderboardPosition[];

export type CreateLeaderboard = z.infer<typeof createLeaderboardSchema>;
