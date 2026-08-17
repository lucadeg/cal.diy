import { prisma } from "@calcom/prisma";
import { AssignmentReasonEnum } from "@calcom/prisma/enums";

export interface HostAssignmentCandidate {
  userId: number;
  weight: number;
  priority: number;
  isFixed: boolean;
}

export interface RoundRobinSelectionResult {
  assignedUserId: number;
  reason: "LEAST_RECENTLY_BOOKED" | "HIGHEST_WEIGHT" | "ONLY_AVAILABLE" | "FIXED_HOST";
}

export class RoundRobinSchedulingService {
  /**
   * Determine the optimal host for a round-robin booking using weighted fair queuing
   * and booking history recency.
   */
  static async selectHost(
    eventTypeId: number,
    availableHostUserIds: number[],
    bookingStartTime: Date
  ): Promise<RoundRobinSelectionResult | null> {
    if (availableHostUserIds.length === 0) {
      return null;
    }

    if (availableHostUserIds.length === 1) {
      return {
        assignedUserId: availableHostUserIds[0],
        reason: "ONLY_AVAILABLE",
      };
    }

    // 1. Fetch host configuration for this event type
    const hosts = await prisma.host.findMany({
      where: {
        eventTypeId,
        userId: { in: availableHostUserIds },
      },
      select: {
        userId: true,
        weight: true,
        priority: true,
        isFixed: true,
      },
    });

    if (hosts.length === 0) {
      return {
        assignedUserId: availableHostUserIds[0],
        reason: "ONLY_AVAILABLE",
      };
    }

    // Fixed host has immediate precedence if available
    const fixedHost = hosts.find((h: { userId: number; weight: number | null; priority: number | null; isFixed: boolean }) => h.isFixed);
    if (fixedHost) {
      return {
        assignedUserId: fixedHost.userId,
        reason: "FIXED_HOST",
      };
    }

    // 2. Query booking counts and last assigned timestamp in the rolling 30-day window
    const thirtyDaysAgo = new Date(bookingStartTime.getTime() - 30 * 24 * 60 * 60 * 1000);
    const hostBookings = await prisma.booking.groupBy({
      by: ["userId"],
      where: {
        eventTypeId,
        userId: { in: availableHostUserIds },
        createdAt: { gte: thirtyDaysAgo },
        status: { in: ["ACCEPTED", "CONFIRMED"] },
      },
      _count: {
        id: true,
      },
      _max: {
        createdAt: true,
      },
    });

    const bookingStatsMap = new Map<number, { count: number; lastBookedAt: Date | null }>();
    for (const stat of hostBookings) {
      if (stat.userId) {
        bookingStatsMap.set(stat.userId, {
          count: stat._count.id,
          lastBookedAt: stat._max.createdAt,
        });
      }
    }

    // 3. Compute weighted score for each candidate (lower score = higher priority to be picked)
    let bestHost: HostAssignmentCandidate | null = null;
    let minScore = Number.POSITIVE_INFINITY;
    let oldestBookingTime = new Date(8640000000000000); // Max Date

    for (const host of hosts) {
      const stats = bookingStatsMap.get(host.userId) || { count: 0, lastBookedAt: null };
      const weight = Math.max(host.weight || 100, 1);
      // Normalized booking load = raw_bookings / weight_factor
      const normalizedLoad = (stats.count * 100) / weight;

      // Higher priority tier (e.g. 1 is highest priority) lowers the score
      const priorityOffset = (host.priority || 2) * 10;
      const totalScore = normalizedLoad + priorityOffset;

      if (totalScore < minScore) {
        minScore = totalScore;
        bestHost = host;
        oldestBookingTime = stats.lastBookedAt || new Date(0);
      } else if (Math.abs(totalScore - minScore) < 0.001) {
        // Tie-breaker: Pick host with oldest last-booked timestamp
        const hostLastBooked = stats.lastBookedAt || new Date(0);
        if (hostLastBooked < oldestBookingTime) {
          bestHost = host;
          oldestBookingTime = hostLastBooked;
        }
      }
    }

    const selectedUserId = bestHost ? bestHost.userId : availableHostUserIds[0];

    return {
      assignedUserId: selectedUserId,
      reason: "LEAST_RECENTLY_BOOKED",
    };
  }

  /**
   * Log the assignment reason to the database for auditability.
   */
  static async recordAssignmentReason(bookingId: number, reasonString: string) {
    return prisma.assignmentReason.create({
      data: {
        bookingId,
        reasonEnum: AssignmentReasonEnum.RR_REASSIGNED,
        reasonString,
      },
    });
  }
}
