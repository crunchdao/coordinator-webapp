import { z } from "zod";
import { PublicKey } from "@solana/web3.js";
import { registrationSchema } from "../application/schemas/registration";

export enum CoordinatorStatus {
  UNREGISTERED = "unregistered",
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface CoordinatorState {
  state: {
    pending?: object;
    approved?: object;
    rejected?: object;
  };
  owner: PublicKey;
  bump: number;
  name: string;
}

export type RegistrationFormData = z.infer<typeof registrationSchema>;

export interface CoordinatorData {
  status: CoordinatorStatus;
  address: string | null;
  data: CoordinatorState | null;
}

export type CoordinatorCpiState = "Pending" | "Approved" | "Rejected";

export interface CoordinatorCpi {
  address: string;
  state: CoordinatorCpiState;
  name: string;
  owner: string;
}

export interface GetCoordinatorsParams {
  owner?: string;
}
