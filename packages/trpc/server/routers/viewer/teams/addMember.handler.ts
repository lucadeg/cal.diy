import { TeamRepository } from "@calcom/features/teams";
import { TRPCError } from "@trpc/server";
import type { TAddMemberInputSchema } from "./addMember.schema";

type AddMemberOptions = {
  input: TAddMemberInputSchema;
};

export const addMemberHandler = async ({ input }: AddMemberOptions) => {
  try {
    return await TeamRepository.addMember(input.teamId, input.userId, input.role);
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error instanceof Error ? error.message : "Failed to add team member",
    });
  }
};
