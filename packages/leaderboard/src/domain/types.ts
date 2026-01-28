import { z } from "zod";
import { GaugeConfiguration } from "@coordinator/chart/src/domain/types";
import {
  columnTypeSchema,
  formatTypeSchema,
} from "../application/schemas/createLeaderboardSchema";

export type LeaderboardPosition = Record<string, unknown>;

export type FormatType = z.infer<typeof formatTypeSchema>;

export type ColumnType = z.infer<typeof columnTypeSchema>;

export type ProjectConfiguration = {
  type: "model";
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

export type GetModelsResponse = {
  model_id: string;
  model_name: string;
  cruncher_name: string;
  cruncher_id: string;
  deployment_id: string;
}[];
