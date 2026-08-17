import { InstantMeetingService } from "@calcom/features/teams";
import type { TrpcSessionUser } from "@calcom/trpc/server/types";
import { TRPCError } from "@trpc/server";
import type { TAcceptInstantMeetingSchema } from "./acceptInstantMeeting.schema";

type AcceptInstantMeetingOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TAcceptInstantMeetingSchema;
};

export const acceptInstantMeetingHandler = async ({ ctx, input }: AcceptInstantMeetingOptions) => {
  try {
    if (!ctx.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "User is not authenticated" });
    }
    return await InstantMeetingService.acceptInstantMeeting(input.token, ctx.user.id);
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: error instanceof Error ? error.message : "Failed to accept instant meeting",
    });
  }
};
