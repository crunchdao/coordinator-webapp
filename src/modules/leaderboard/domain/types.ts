import { z } from "zod";
import { GaugeConfiguration } from "@/modules/chart/domain/types";
import {
  columnTypeSchema,
  formatTypeSchema,
} from "../application/schemas/createLeaderboardSchema";

export type LeaderboardPosition = Record<string, unknown>;

export type FormatType = z.infer<typeof formatTypeSchema>;

export type ColumnType = z.infer<typeof columnTypeSchema>;

export type ProjectConfiguration = {
  type: "project";
  statusProperty?: string;
};

export type NativeConfiguration = GaugeConfiguration | ProjectConfiguration;

export type LeaderboardColumn = {
  id: number;
  type: ColumnType;
  property: string;
  format: FormatType | null;
  displayName: string;
  tooltip: string | null;
  nativeConfiguration: NativeConfiguration | null;
  order: number;
};

export type Leaderboard = LeaderboardPosition[];
