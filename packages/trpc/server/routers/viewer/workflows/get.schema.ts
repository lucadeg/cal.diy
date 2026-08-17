import { z } from "zod";

export const ZGetWorkflowInputSchema = z.object({
  id: z.string(),
});

export type TGetWorkflowInputSchema = z.infer<typeof ZGetWorkflowInputSchema>;
