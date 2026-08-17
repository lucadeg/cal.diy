import { z } from "zod";
import authedProcedure from "../../../procedures/authedProcedure";
import { router } from "../../../trpc";
import { DelegationService } from "@calcom/features/delegation";

export const ZDelegationRuleSchema = z.object({
  delegateUserId: z.number(),
  canBook: z.boolean().default(true),
  canReschedule: z.boolean().default(true),
  canCancel: z.boolean().default(true),
});

export const delegationRouter = router({
  list: authedProcedure.query(async ({ ctx }) => {
    return DelegationService.getDelegates(ctx.user.id);
  }),

  set: authedProcedure.input(ZDelegationRuleSchema).mutation(async ({ input, ctx }) => {
    return DelegationService.setDelegation({
      delegatorUserId: ctx.user.id,
      ...input,
    });
  }),
});
