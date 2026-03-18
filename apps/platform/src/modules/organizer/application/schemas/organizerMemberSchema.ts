"use client";

import { z } from "zod";
import { OrganizerMemberRole } from "../../domain/types";

export const createOrganizerMemberSchema = z.object({
  userId: z.number().int(),
  role: z.nativeEnum(OrganizerMemberRole),
});

export const updateOrganizerMemberSchema = z.object({
  role: z.nativeEnum(OrganizerMemberRole),
});
