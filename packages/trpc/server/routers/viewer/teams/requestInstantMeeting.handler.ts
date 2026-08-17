import { InstantMeetingService } from "@calcom/features/teams";
import { TRPCError } from "@trpc/server";
import type { TRequestInstantMeetingSchema } from "./requestInstantMeeting.schema";

type RequestInstantMeetingOptions = {
  input: TRequestInstantMeetingSchema;
};

export const requestInstantMeetingHandler = async ({ input }: RequestInstantMeetingOptions) => {
  try {
    return await InstantMeetingService.createSession(input);
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error instanceof Error ? error.message : "Failed to create instant meeting session",
    });
  }
};
