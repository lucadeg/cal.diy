import { WorkflowRepository } from "@calcom/features/workflows";
import type { TrpcSessionUser } from "@calcom/trpc/server/types";
import { TRPCError } from "@trpc/server";
import type { TUpdateWorkflowInputSchema } from "./update.schema";

type UpdateWorkflowOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TUpdateWorkflowInputSchema;
};

export const updateWorkflowHandler = async ({ ctx, input }: UpdateWorkflowOptions) => {
  try {
    if (!ctx.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "User is not authenticated" });
    }
    return await WorkflowRepository.saveWorkflow(ctx.user.id, input);
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error instanceof Error ? error.message : "Failed to update workflow",
    });
  }
};
