"use client";

import { z } from "zod";

export const updateOrganizerSchema = z.object({
  displayName: z.string().min(1),
  onChainId: z.string().optional(),
  logoImageUrl: z.string().optional(),
  bannerImageUrl: z.string().optional(),
});
