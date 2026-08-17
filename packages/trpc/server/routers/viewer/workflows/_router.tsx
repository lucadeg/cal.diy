import authedProcedure from "../../../procedures/authedProcedure";
import { router } from "../../../trpc";
import { ZCreateWorkflowInputSchema } from "./create.schema";
import { ZDeleteWorkflowInputSchema } from "./delete.schema";
import { ZGetWorkflowInputSchema } from "./get.schema";
import { ZListWorkflowsInputSchema } from "./list.schema";
import { ZUpdateWorkflowInputSchema } from "./update.schema";

export const workflowsRouter = router({
  list: authedProcedure.input(ZListWorkflowsInputSchema).query(async ({ input, ctx }) => {
    const { listWorkflowsHandler } = await import("./list.handler");
    return listWorkflowsHandler({ ctx, input });
  }),

  get: authedProcedure.input(ZGetWorkflowInputSchema).query(async ({ input, ctx }) => {
    const { getWorkflowHandler } = await import("./get.handler");
    return getWorkflowHandler({ ctx, input });
  }),

  create: authedProcedure.input(ZCreateWorkflowInputSchema).mutation(async ({ input, ctx }) => {
    const { createWorkflowHandler } = await import("./create.handler");
    return createWorkflowHandler({ ctx, input });
  }),

  update: authedProcedure.input(ZUpdateWorkflowInputSchema).mutation(async ({ input, ctx }) => {
    const { updateWorkflowHandler } = await import("./update.handler");
    return updateWorkflowHandler({ ctx, input });
  }),

  delete: authedProcedure.input(ZDeleteWorkflowInputSchema).mutation(async ({ input, ctx }) => {
    const { deleteWorkflowHandler } = await import("./delete.handler");
    return deleteWorkflowHandler({ ctx, input });
  }),
});
