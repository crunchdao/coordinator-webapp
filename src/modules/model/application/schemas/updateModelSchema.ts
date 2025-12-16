import { z } from "zod";
import { DesiredState } from "../../domain/types";

export const updateModelSchema = z.object({
  desiredState: z.nativeEnum(DesiredState),
});
