import { prisma } from "@calcom/prisma";


export interface ImpersonationSession {
  impersonatorId: number;
  targetUserId: number;
  sessionToken: string;
  expiresAt: Date;
}

export class ImpersonationService {
  /**
   * Superadmin generates an impersonation token to securely inspect user account.
   */
  static async startImpersonation(impersonatorId: number, targetUserId: number): Promise<ImpersonationSession> {
    const admin = await prisma.user.findUnique({ where: { id: impersonatorId } });
    if (admin?.role !== "ADMIN") {
      throw new Error("Unauthorized: Only admins can initiate impersonation sessions");
    }

    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      throw new Error("Target user not found");
    }

    if (targetUser.disableImpersonation) {
      throw new Error("Target user has explicitly disabled impersonation");
    }

    const sessionToken = Array.from(globalThis.crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour session

    return {
      impersonatorId,
      targetUserId,
      sessionToken,
      expiresAt,
    };
  }
}
