import { z } from "zod";
import { DesiredState } from "../../domain/types";

export const addModelSchema = z.object({
  desired_state: z.nativeEnum(DesiredState),
  model_name: z.string().nullable().optional(),
  cruncher_name: z.string().nullable().optional(),
  files: z.array(z.instanceof(File)).min(1, "At least one file is required"),
});
