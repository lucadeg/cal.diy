import { TeamRepository } from "@calcom/features/teams";
import type { TrpcSessionUser } from "@calcom/trpc/server/types";
import { TRPCError } from "@trpc/server";

type ListTeamsOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
};

export const listTeamsHandler = async ({ ctx }: ListTeamsOptions) => {
  try {
    if (!ctx.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "User is not authenticated" });
    }
    return await TeamRepository.listUserTeams(ctx.user.id);
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error instanceof Error ? error.message : "Failed to list user teams",
    });
  }
};
