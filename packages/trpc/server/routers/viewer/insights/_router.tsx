import { z } from "zod";
import authedProcedure from "../../../procedures/authedProcedure";
import { router } from "../../../trpc";
import { InsightsAggregator } from "@calcom/features/insights";

export const ZGetInsightsInputSchema = z.object({
  startDate: z.string().transform((val) => new Date(val)),
  endDate: z.string().transform((val) => new Date(val)),
  teamId: z.number().optional(),
});

export const insightsRouter = router({
  getDashboard: authedProcedure.input(ZGetInsightsInputSchema).query(async ({ input, ctx }) => {
    return InsightsAggregator.generateReport(ctx.user.id, input.startDate, input.endDate, input.teamId);
  }),
});
