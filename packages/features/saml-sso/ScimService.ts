import { prisma } from "@calcom/prisma";

export interface ScimUserResource {
  schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"];
  id: string;
  userName: string;
  name: {
    formatted: string;
    familyName?: string;
    givenName?: string;
  };
  emails: Array<{ value: string; primary: boolean }>;
  active: boolean;
}

export class ScimService {
  /**
   * Provision or update user via SCIM 2.0 protocol.
   */
  static async provisionUser(scimUser: ScimUserResource) {
    const primaryEmail = scimUser.emails.find((e) => e.primary)?.value || scimUser.emails[0]?.value;
    if (!primaryEmail) {
      throw new Error("SCIM user payload must contain a valid email address");
    }

    return prisma.user.upsert({
      where: { email: primaryEmail.toLowerCase() },
      update: {
        name: scimUser.name.formatted || `${scimUser.name.givenName || ""} ${scimUser.name.familyName || ""}`.trim(),
        identityProvider: "SAML",
      },
      create: {
        email: primaryEmail.toLowerCase(),
        name: scimUser.name.formatted || `${scimUser.name.givenName || ""} ${scimUser.name.familyName || ""}`.trim(),
        username: primaryEmail.split("@")[0].toLowerCase(),
        identityProvider: "SAML",
      },
    });
  }

  /**
   * Deprovision/deactivate user via SCIM.
   */
  static async deprovisionUser(userId: number) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        // Mark inactive or disable impersonation
        metadata: {
          scimStatus: "DEPROVISIONED",
        },
      },
    });
  }
}
