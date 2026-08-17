import { TeamRepository } from "@calcom/features/teams";
import type { TrpcSessionUser } from "@calcom/trpc/server/types";
import { TRPCError } from "@trpc/server";
import type { TCreateTeamInputSchema } from "./create.schema";

type CreateTeamOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TCreateTeamInputSchema;
};

export const createTeamHandler = async ({ ctx, input }: CreateTeamOptions) => {
  try {
    if (!ctx.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "User is not authenticated" });
    }

    const isSlugAvailable = await TeamRepository.isSlugAvailable(input.slug);
    if (!isSlugAvailable) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "A team with this slug already exists",
      });
    }

    return await TeamRepository.createTeam({
      ...input,
      creatorUserId: ctx.user.id,
    });
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error instanceof Error ? error.message : "Failed to create team",
    });
  }
};
