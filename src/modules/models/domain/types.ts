import z from "zod";
import { addModelSchema } from "../application/schemas/addModelSchema";
import { updateModelSchema } from "../application/schemas/updateModelSchema";

export interface Model {
  id: number;
  name: string;
  path: string;
  desiredState: string;
}

export type AddModelBody = z.infer<typeof addModelSchema>;
export type UpdateModelBody = z.infer<typeof updateModelSchema>;
