import z from "zod";
import { globalSettingsSchema } from "../application/schemas/settingsSchema";

export type GlobalSettings = z.infer<typeof globalSettingsSchema>;
