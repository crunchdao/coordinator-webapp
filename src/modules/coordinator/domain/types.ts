import { z } from "zod";
import { registrationSchema } from "../application/schemas/registration";

export enum CoordinatorStatus {
  UNREGISTERED = "unregistered",
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected"
}

export interface CoordinatorAccount {
  publicKey: string;
  organizationName: string;
  status: CoordinatorStatus;
  registeredAt?: Date;
  approvedAt?: Date;
}

export interface CoordinatorState {
  state: {
    pending?: {};
    approved?: {};
    rejected?: {};
  };
  owner: string;
  bump: number;
  name: string;
}

export type RegistrationFormData = z.infer<typeof registrationSchema>;