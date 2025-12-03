import { z } from "zod";
import { gaugeConfigurationSchema } from "@/modules/leaderboard/application/schemas/createLeaderboardSchema";

export type GaugeConfiguration = z.infer<typeof gaugeConfigurationSchema>;
