import { z } from "zod";
import authedProcedure from "../../../procedures/authedProcedure";
import { router } from "../../../trpc";
import { RecordingManager } from "@calcom/features/recordings";

export const recordingsRouter = router({
  listByBooking: authedProcedure
    .input(z.object({ bookingUid: z.string() }))
    .query(async ({ input }) => {
      return RecordingManager.listRecordingsForBooking(input.bookingUid);
    }),
});
