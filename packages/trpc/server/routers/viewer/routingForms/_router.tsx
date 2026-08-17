import { z } from "zod";
import authedProcedure from "../../../procedures/authedProcedure";
import publicProcedure from "../../../procedures/publicProcedure";
import { router } from "../../../trpc";
import { ZCreateRoutingFormSchema } from "./create.schema";
import { ZListRoutingFormsSchema } from "./list.schema";
import { ZSubmitAndRouteSchema } from "./submitAndRoute.schema";
import { RoutingFormRepository } from "@calcom/features/routing-forms";

export const routingFormsRouter = router({
  list: authedProcedure.input(ZListRoutingFormsSchema).query(async ({ input, ctx }) => {
    const { listRoutingFormsHandler } = await import("./list.handler");
    return listRoutingFormsHandler({ ctx, input });
  }),

  get: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    return RoutingFormRepository.getForm(input.id);
  }),

  create: authedProcedure.input(ZCreateRoutingFormSchema).mutation(async ({ input, ctx }) => {
    const { createRoutingFormHandler } = await import("./create.handler");
    return createRoutingFormHandler({ ctx, input });
  }),

  update: authedProcedure.input(ZCreateRoutingFormSchema.extend({ id: z.string() })).mutation(async ({ input, ctx }) => {
    return RoutingFormRepository.saveForm(ctx.user.id, input);
  }),

  delete: authedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
    return RoutingFormRepository.deleteForm(ctx.user.id, input.id);
  }),

  submitAndRoute: publicProcedure.input(ZSubmitAndRouteSchema).mutation(async ({ input }) => {
    const { submitAndRouteHandler } = await import("./submitAndRoute.handler");
    return submitAndRouteHandler({ input });
  }),
});
