import { z } from "zod";

export const ZRequestInstantMeetingSchema = z.object({
  eventTypeId: z.number(),
  bookerEmail: z.string().email(),
  bookerName: z.string().min(1),
});

export type TRequestInstantMeetingSchema = z.infer<typeof ZRequestInstantMeetingSchema>;
