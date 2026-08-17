import { z } from "zod";

export const ZAcceptInstantMeetingSchema = z.object({
  token: z.string(),
});

export type TAcceptInstantMeetingSchema = z.infer<typeof ZAcceptInstantMeetingSchema>;
