import { TeamRepository } from "@calcom/features/teams";
import { TRPCError } from "@trpc/server";
import type { TRemoveMemberInputSchema } from "./removeMember.schema";

type RemoveMemberOptions = {
  input: TRemoveMemberInputSchema;
};

export const removeMemberHandler = async ({ input }: RemoveMemberOptions) => {
  try {
    return await TeamRepository.removeMember(input.teamId, input.userId);
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error instanceof Error ? error.message : "Failed to remove team member",
    });
  }
};
