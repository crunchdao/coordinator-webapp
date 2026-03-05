import { z } from "zod";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

export const environmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  network: z.nativeEnum(WalletAdapterNetwork),
  rpcUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  hubUrl: z.string().optional().or(z.literal("")),
});

export const environmentsFormSchema = z.object({
  environments: z
    .array(environmentSchema)
    .min(1, "At least one environment is required"),
});

export const settingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  displayName: z.string().min(1, "Display name is required"),
  fullName: z.string(),
  shortDescription: z.string(),
  url: z.string(),
  start: z.string(),
  end: z.string(),
  visibility: z.enum(["HIDDEN", "PUBLIC"]),
  cardImageUrl: z.string(),
  bannerImageUrl: z.string(),
  documentationUrl: z.string(),
  notebookUrl: z.string(),
  advancedNotebookUrl: z.string(),
  discussionUrl: z.string(),
  codeUrl: z.string(),
  ruleContentUrl: z.string(),
  prizePoolText: z.string(),
  prizePoolShortText: z.string(),
  prizePoolUsd: z.number(),
});

export const slugSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase letters, numbers, and hyphens only"
    ),
});

export type EnvironmentFormData = z.infer<typeof environmentSchema>;
export type EnvironmentsFormData = z.infer<typeof environmentsFormSchema>;
export type SettingsFormData = z.infer<typeof settingsSchema>;
export type SlugFormData = z.infer<typeof slugSchema>;
