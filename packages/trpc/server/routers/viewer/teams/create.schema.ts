import { z } from "zod";

export const ZCreateTeamInputSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  bio: z.string().optional(),
  logoUrl: z.string().optional(),
  hideBookATeamMember: z.boolean().optional(),
  isPrivate: z.boolean().optional(),
});

export type TCreateTeamInputSchema = z.infer<typeof ZCreateTeamInputSchema>;
