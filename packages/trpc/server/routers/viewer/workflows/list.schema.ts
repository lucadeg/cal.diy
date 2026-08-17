import { z } from "zod";

export const ZListWorkflowsInputSchema = z.object({
  teamId: z.number().optional(),
}).optional();

export type TListWorkflowsInputSchema = z.infer<NonNullable<typeof ZListWorkflowsInputSchema>>;
