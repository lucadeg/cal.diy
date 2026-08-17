import { RoutingFormRepository } from "@calcom/features/routing-forms";
import type { TrpcSessionUser } from "@calcom/trpc/server/types";
import { TRPCError } from "@trpc/server";
import type { TCreateRoutingFormSchema } from "./create.schema";

type CreateRoutingFormOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TCreateRoutingFormSchema;
};

export const createRoutingFormHandler = async ({ ctx, input }: CreateRoutingFormOptions) => {
  try {
    if (!ctx.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "User is not authenticated" });
    }
    return await RoutingFormRepository.saveForm(ctx.user.id, input);
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error instanceof Error ? error.message : "Failed to create routing form",
    });
  }
};
