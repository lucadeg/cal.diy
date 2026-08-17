import { prisma } from "@calcom/prisma";

export interface SamlConfiguration {
  id: string;
  orgId?: number;
  teamId?: number;
  entityId: string;
  ssoUrl: string;
  certificate: string;
  enforceSso: boolean;
}

export class SamlService {
  /**
   * Configure or update SAML IdP parameters for an organization or enterprise team.
   */
  static async setSamlConfiguration(input: SamlConfiguration): Promise<SamlConfiguration> {
    if (input.teamId) {
      const team = await prisma.team.findUnique({ where: { id: input.teamId } });
      const metadata = (team?.metadata as Record<string, unknown>) || {};
      await prisma.team.update({
        where: { id: input.teamId },
        data: {
          metadata: {
            ...metadata,
            saml: input,
          },
        },
      });
    }
    return input;
  }

  static async getSamlConfiguration(teamId: number): Promise<SamlConfiguration | null> {
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    const metadata = (team?.metadata as Record<string, unknown>) || {};
    return (metadata.saml as SamlConfiguration) || null;
  }
}
