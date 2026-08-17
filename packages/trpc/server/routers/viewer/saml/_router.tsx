import { z } from "zod";
import authedProcedure from "../../../procedures/authedProcedure";
import { router } from "../../../trpc";
import { SamlService } from "@calcom/features/saml-sso";

export const ZSamlConfigSchema = z.object({
  id: z.string(),
  teamId: z.number().optional(),
  entityId: z.string().min(1),
  ssoUrl: z.string().url(),
  certificate: z.string().min(1),
  enforceSso: z.boolean().default(false),
});

export const samlRouter = router({
  get: authedProcedure.input(z.object({ teamId: z.number() })).query(async ({ input }) => {
    return SamlService.getSamlConfiguration(input.teamId);
  }),

  set: authedProcedure.input(ZSamlConfigSchema).mutation(async ({ input }) => {
    return SamlService.setSamlConfiguration(input);
  }),
});
