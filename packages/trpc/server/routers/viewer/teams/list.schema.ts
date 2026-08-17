import { z } from "zod";

export const ZListTeamsInputSchema = z.object({}).optional();
export type TListTeamsInputSchema = z.infer<NonNullable<typeof ZListTeamsInputSchema>>;
