import { z } from "zod";

export const ZSubmitAndRouteSchema = z.object({
  formId: z.string(),
  responses: z.record(z.union([z.string(), z.number(), z.array(z.string())])),
});

export type TSubmitAndRouteSchema = z.infer<typeof ZSubmitAndRouteSchema>;
