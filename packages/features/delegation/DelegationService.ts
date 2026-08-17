import { prisma } from "@calcom/prisma";

export interface DelegationRule {
  delegatorUserId: number;
  delegateUserId: number;
  canBook: boolean;
  canReschedule: boolean;
  canCancel: boolean;
}

export class DelegationService {
  /**
   * Configure calendar delegation between delegator (e.g. executive) and delegate (e.g. assistant).
   */
  static async setDelegation(rule: DelegationRule) {
    const delegator = await prisma.user.findUnique({ where: { id: rule.delegatorUserId } });
    const metadata = (delegator?.metadata as Record<string, unknown>) || {};
    const delegations = (metadata.delegations as DelegationRule[]) || [];

    const existingIndex = delegations.findIndex((d) => d.delegateUserId === rule.delegateUserId);
    if (existingIndex >= 0) {
      delegations[existingIndex] = rule;
    } else {
      delegations.push(rule);
    }

    await prisma.user.update({
      where: { id: rule.delegatorUserId },
      data: {
        metadata: {
          ...metadata,
          delegations,
        },
      },
    });

    return rule;
  }

  static async getDelegates(delegatorUserId: number): Promise<DelegationRule[]> {
    const delegator = await prisma.user.findUnique({ where: { id: delegatorUserId } });
    const metadata = (delegator?.metadata as Record<string, unknown>) || {};
    return (metadata.delegations as DelegationRule[]) || [];
  }
}
