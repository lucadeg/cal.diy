import { RoutingFormRepository, RoutingRuleEvaluator } from "@calcom/features/routing-forms";
import { TRPCError } from "@trpc/server";
import type { TSubmitAndRouteSchema } from "./submitAndRoute.schema";

type SubmitAndRouteOptions = {
  input: TSubmitAndRouteSchema;
};

export const submitAndRouteHandler = async ({ input }: SubmitAndRouteOptions) => {
  try {
    const form = await RoutingFormRepository.getForm(input.formId);
    if (!form) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Routing form not found",
      });
    }
    return RoutingRuleEvaluator.evaluate(form, input.responses);
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error instanceof Error ? error.message : "Failed to evaluate routing form responses",
    });
  }
};
