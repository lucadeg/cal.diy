import { z } from "zod";

export const ZRemoveMemberInputSchema = z.object({
  teamId: z.number(),
  userId: z.number(),
});

export type TRemoveMemberInputSchema = z.infer<typeof ZRemoveMemberInputSchema>;
