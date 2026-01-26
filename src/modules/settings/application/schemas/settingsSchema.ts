import { z } from "zod";
import { PublicKey } from "@solana/web3.js";

const isValidPublicKey = (value: string) => {
  if (!value) return true; // Allow empty
  try {
    new PublicKey(value);
    return true;
  } catch {
    return false;
  }
};

export const globalSettingsSchema = z.object({
  endpoints: z.object({
    leaderboard: z.string().min(1, "Endpoint is required"),
    models: z.string().min(1, "Endpoint is required"),
  }),
  logs: z.object({
    containerNames: z
      .array(z.string().min(1, "Container name cannot be empty"))
      .min(1, "At least one container name is required"),
  }),
  multisig: z
    .object({
      address: z
        .string()
        .refine(isValidPublicKey, "Invalid Solana public key")
        .optional()
        .or(z.literal("")),
    })
    .optional(),
});

export type GlobalSettingsFormData = z.infer<typeof globalSettingsSchema>;
