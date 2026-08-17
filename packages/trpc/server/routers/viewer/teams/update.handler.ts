import { TeamRepository } from "@calcom/features/teams";
import { TRPCError } from "@trpc/server";
import type { TUpdateTeamInputSchema } from "./update.schema";

type UpdateTeamOptions = {
  input: TUpdateTeamInputSchema;
};

export const updateTeamHandler = async ({ input }: UpdateTeamOptions) => {
  try {
    return await TeamRepository.updateTeam(input);
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error instanceof Error ? error.message : "Failed to update team",
    });
  }
};
