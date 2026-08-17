import { TeamRepository } from "@calcom/features/teams";
import { TRPCError } from "@trpc/server";
import type { TGetTeamInputSchema } from "./get.schema";

type GetTeamOptions = {
  input: TGetTeamInputSchema;
};

export const getTeamHandler = async ({ input }: GetTeamOptions) => {
  try {
    const team = await TeamRepository.findById(input.id);
    if (!team) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Team not found",
      });
    }
    return team;
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error instanceof Error ? error.message : "Failed to fetch team details",
    });
  }
};
