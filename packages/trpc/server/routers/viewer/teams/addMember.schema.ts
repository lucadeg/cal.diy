import { z } from "zod";
import { MembershipRole } from "@calcom/prisma/enums";

export const ZAddMemberInputSchema = z.object({
  teamId: z.number(),
  userId: z.number(),
  role: z.nativeEnum(MembershipRole).optional(),
});

export type TAddMemberInputSchema = z.infer<typeof ZAddMemberInputSchema>;
