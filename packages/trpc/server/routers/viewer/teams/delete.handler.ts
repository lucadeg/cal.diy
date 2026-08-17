import { TeamRepository } from "@calcom/features/teams";
import { TRPCError } from "@trpc/server";
import type { TDeleteTeamInputSchema } from "./delete.schema";

type DeleteTeamOptions = {
  input: TDeleteTeamInputSchema;
};

export const deleteTeamHandler = async ({ input }: DeleteTeamOptions) => {
  try {
    return await TeamRepository.deleteTeam(input.id);
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error instanceof Error ? error.message : "Failed to delete team",
    });
  }
};
