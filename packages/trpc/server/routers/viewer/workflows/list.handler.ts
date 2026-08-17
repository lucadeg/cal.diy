import { WorkflowRepository } from "@calcom/features/workflows";
import type { TrpcSessionUser } from "@calcom/trpc/server/types";
import { TRPCError } from "@trpc/server";
import type { TListWorkflowsInputSchema } from "./list.schema";

type ListWorkflowsOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input?: TListWorkflowsInputSchema;
};

export const listWorkflowsHandler = async ({ ctx, input }: ListWorkflowsOptions) => {
  try {
    if (!ctx.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "User is not authenticated" });
    }
    return await WorkflowRepository.listWorkflows(ctx.user.id, input?.teamId);
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error instanceof Error ? error.message : "Failed to list workflows",
    });
  }
};
