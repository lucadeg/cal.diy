import { z } from "zod";
import authedProcedure from "../../../procedures/authedProcedure";
import { router } from "../../../trpc";
import { ImpersonationService } from "@calcom/features/impersonation";

export const impersonationRouter = router({
  start: authedProcedure
    .input(z.object({ targetUserId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return ImpersonationService.startImpersonation(ctx.user.id, input.targetUserId);
    }),
});
