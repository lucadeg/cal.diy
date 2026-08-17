import { z } from "zod";

export const ZGetTeamInputSchema = z.object({
  id: z.number(),
});

export type TGetTeamInputSchema = z.infer<typeof ZGetTeamInputSchema>;
