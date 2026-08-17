export interface BookingAnalyticsSummary {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  rescheduledBookings: number;
  noShowBookings: number;
  completionRate: number; // percentage
  noShowRate: number; // percentage
  averageDurationMinutes: number;
  totalDurationHours: number;
}

export interface DailyBookingMetric {
  date: string; // YYYY-MM-DD
  count: number;
  completed: number;
  cancelled: number;
}

export interface HostUtilizationMetric {
  userId: number;
  userName: string;
  userEmail: string;
  totalBookings: number;
  totalHours: number;
  utilizationPercentage: number;
}

export interface InsightsReport {
  summary: BookingAnalyticsSummary;
  timeSeries: DailyBookingMetric[];
  hostUtilization: HostUtilizationMetric[];
  popularEventTypes: Array<{
    eventTypeId: number;
    title: string;
    bookingCount: number;
  }>;
}
