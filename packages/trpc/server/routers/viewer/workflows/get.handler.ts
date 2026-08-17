import { WorkflowRepository } from "@calcom/features/workflows";
import type { TrpcSessionUser } from "@calcom/trpc/server/types";
import { TRPCError } from "@trpc/server";
import type { TGetWorkflowInputSchema } from "./get.schema";

type GetWorkflowOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TGetWorkflowInputSchema;
};

export const getWorkflowHandler = async ({ ctx, input }: GetWorkflowOptions) => {
  try {
    if (!ctx.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "User is not authenticated" });
    }
    const workflow = await WorkflowRepository.getWorkflow(ctx.user.id, input.id);
    if (!workflow) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Workflow not found",
      });
    }
    return workflow;
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error instanceof Error ? error.message : "Failed to fetch workflow",
    });
  }
};
