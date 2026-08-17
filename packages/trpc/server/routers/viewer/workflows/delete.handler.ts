import { WorkflowRepository } from "@calcom/features/workflows";
import type { TrpcSessionUser } from "@calcom/trpc/server/types";
import { TRPCError } from "@trpc/server";
import type { TDeleteWorkflowInputSchema } from "./delete.schema";

type DeleteWorkflowOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TDeleteWorkflowInputSchema;
};

export const deleteWorkflowHandler = async ({ ctx, input }: DeleteWorkflowOptions) => {
  try {
    if (!ctx.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "User is not authenticated" });
    }
    return await WorkflowRepository.deleteWorkflow(ctx.user.id, input.id);
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error instanceof Error ? error.message : "Failed to delete workflow",
    });
  }
};
