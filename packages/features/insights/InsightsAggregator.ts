import { prisma } from "@calcom/prisma";
import type { InsightsReport, BookingAnalyticsSummary, DailyBookingMetric, HostUtilizationMetric } from "./types";

export class InsightsAggregator {
  /**
   * Aggregate metrics and time series for a user or team across a given date range.
   */
  static async generateReport(
    userId: number,
    startDate: Date,
    endDate: Date,
    teamId?: number
  ): Promise<InsightsReport> {
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid date range provided for insights report");
    }

    if (startDate.getTime() > endDate.getTime()) {
      throw new Error("startDate cannot be after endDate");
    }

    const whereClause = teamId
      ? {
          eventType: { teamId },
          startTime: { gte: startDate, lte: endDate },
        }
      : {
          userId,
          startTime: { gte: startDate, lte: endDate },
        };

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      select: {
        id: true,
        uid: true,
        startTime: true,
        endTime: true,
        status: true,
        paid: true,
        userId: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        eventType: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { startTime: "asc" },
    });

    const totalBookings = bookings.length;
    let completedBookings = 0;
    let cancelledBookings = 0;
    let rescheduledBookings = 0;
    let totalMinutes = 0;

    const dailyMap = new Map<string, { count: number; completed: number; cancelled: number }>();
    const hostMap = new Map<number, { name: string; email: string; count: number; minutes: number }>();
    const eventTypeMap = new Map<number, { title: string; count: number }>();

    for (const b of bookings) {
      const duration = Math.max((b.endTime.getTime() - b.startTime.getTime()) / (1000 * 60), 0);
      totalMinutes += duration;

      if (b.status === "ACCEPTED") completedBookings++;
      if (b.status === "CANCELLED") cancelledBookings++;
      if (b.status === "RESCHEDULED") rescheduledBookings++;

      // Daily grouping
      const dateKey = b.startTime.toISOString().split("T")[0];
      const daily = dailyMap.get(dateKey) || { count: 0, completed: 0, cancelled: 0 };
      daily.count++;
      if (b.status === "ACCEPTED") daily.completed++;
      if (b.status === "CANCELLED") daily.cancelled++;
      dailyMap.set(dateKey, daily);

      // Host grouping
      if (b.user) {
        const hostStat = hostMap.get(b.user.id) || {
          name: b.user.name || "Unknown",
          email: b.user.email,
          count: 0,
          minutes: 0,
        };
        hostStat.count++;
        hostStat.minutes += duration;
        hostMap.set(b.user.id, hostStat);
      }

      // Event type grouping
      if (b.eventType) {
        const et = eventTypeMap.get(b.eventType.id) || { title: b.eventType.title, count: 0 };
        et.count++;
        eventTypeMap.set(b.eventType.id, et);
      }
    }

    const summary: BookingAnalyticsSummary = {
      totalBookings,
      completedBookings,
      cancelledBookings,
      rescheduledBookings,
      noShowBookings: 0,
      completionRate: totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0,
      noShowRate: 0,
      averageDurationMinutes: totalBookings > 0 ? Math.round(totalMinutes / totalBookings) : 0,
      totalDurationHours: Math.round((totalMinutes / 60) * 10) / 10,
    };

    const timeSeries: DailyBookingMetric[] = Array.from(dailyMap.entries()).map(([date, stat]) => ({
      date,
      count: stat.count,
      completed: stat.completed,
      cancelled: stat.cancelled,
    }));

    const hostUtilization: HostUtilizationMetric[] = Array.from(hostMap.entries()).map(([uId, stat]) => ({
      userId: uId,
      userName: stat.name,
      userEmail: stat.email,
      totalBookings: stat.count,
      totalHours: Math.round((stat.minutes / 60) * 10) / 10,
      utilizationPercentage: Math.min(Math.round((stat.minutes / (40 * 60 * 4)) * 100), 100), // against 160h standard month
    }));

    const popularEventTypes = Array.from(eventTypeMap.entries()).map(([etId, stat]) => ({
      eventTypeId: etId,
      title: stat.title,
      bookingCount: stat.count,
    }));

    return {
      summary,
      timeSeries,
      hostUtilization,
      popularEventTypes,
    };
  }
}
