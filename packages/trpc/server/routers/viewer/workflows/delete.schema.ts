import { z } from "zod";

export const ZDeleteWorkflowInputSchema = z.object({
  id: z.string(),
});

export type TDeleteWorkflowInputSchema = z.infer<typeof ZDeleteWorkflowInputSchema>;
