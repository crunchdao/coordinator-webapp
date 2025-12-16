import { z } from "zod";
import { DesiredState } from "../../domain/types";

export const addModelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  file: z.instanceof(File).refine((file) => file.size > 0, "File is required"),
  desiredState: z.nativeEnum(DesiredState),
});
