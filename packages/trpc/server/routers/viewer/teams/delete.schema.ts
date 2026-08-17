import { z } from "zod";

export const ZDeleteTeamInputSchema = z.object({
  id: z.number(),
});

export type TDeleteTeamInputSchema = z.infer<typeof ZDeleteTeamInputSchema>;
