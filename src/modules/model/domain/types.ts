import z from "zod";
import { addModelSchema } from "../application/schemas/addModelSchema";
import { updateModelSchema } from "../application/schemas/updateModelSchema";

export enum DesiredState {
  RUNNING = "RUNNING",
  STOPPED = "STOPPED",
}

export enum Status {
  RUNNER_INITIALIZING = "RUNNER_INITIALIZING",
  RUNNER_RUNNING = "RUNNER_RUNNING",
  RUNNER_STOPPING = "RUNNER_STOPPING",
  RUNNER_STOPPED = "RUNNER_STOPPED",
  RUNNER_FAILED = "RUNNER_FAILED",
  BUILDER_BUILDING = "BUILDER_BUILDING",
  BUILDER_FAILED = "BUILDER_FAILED",
  BUILDER_SUCCESS = "BUILDER_SUCCESS",
  CREATED = "CREATED",
}

export interface Model {
  id: string;
  model_name: string | null;
  deployment_id: string;
  desired_state: DesiredState;
  status: Status;
  statusMessage: string | null;
  crunch_id: string;
  cruncher_id: string;
  cruncher_name: string | null;
  builder_log_uri: string | null;
  runner_log_uri: string | null;
}

export type AddModelBody = z.infer<typeof addModelSchema>;
export type UpdateModelBody = z.infer<typeof updateModelSchema>;
