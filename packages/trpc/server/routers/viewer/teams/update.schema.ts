import { z } from "zod";

export const ZUpdateTeamInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  bio: z.string().optional(),
  logoUrl: z.string().optional(),
  hideBookATeamMember: z.boolean().optional(),
  isPrivate: z.boolean().optional(),
});

export type TUpdateTeamInputSchema = z.infer<typeof ZUpdateTeamInputSchema>;
