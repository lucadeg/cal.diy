import { z } from "zod";

export const ZListRoutingFormsSchema = z.object({
  teamId: z.number().optional(),
}).optional();

export type TListRoutingFormsSchema = z.infer<NonNullable<typeof ZListRoutingFormsSchema>>;
