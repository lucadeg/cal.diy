import { ZCreateWorkflowInputSchema } from "./create.schema";
import { z } from "zod";

export const ZUpdateWorkflowInputSchema = ZCreateWorkflowInputSchema.extend({
  id: z.string(),
});

export type TUpdateWorkflowInputSchema = z.infer<typeof ZUpdateWorkflowInputSchema>;
