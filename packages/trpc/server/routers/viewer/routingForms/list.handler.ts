import { RoutingFormRepository } from "@calcom/features/routing-forms";
import type { TrpcSessionUser } from "@calcom/trpc/server/types";
import { TRPCError } from "@trpc/server";
import type { TListRoutingFormsSchema } from "./list.schema";

type ListRoutingFormsOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input?: TListRoutingFormsSchema;
};

export const listRoutingFormsHandler = async ({ ctx, input }: ListRoutingFormsOptions) => {
  try {
    if (!ctx.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "User is not authenticated" });
    }
    return await RoutingFormRepository.listForms(ctx.user.id, input?.teamId);
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error instanceof Error ? error.message : "Failed to list routing forms",
    });
  }
};
