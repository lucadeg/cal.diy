export interface TimeInterval {
  start: Date;
  end: Date;
}

export class CollectiveSchedulingService {
  /**
   * Compute the intersection of available time slots across multiple co-hosts.
   * A slot is available collectively if and only if EVERY required host is free.
   */
  static getCollectiveSlots(
    hostSchedules: Array<{ userId: number; availableSlots: TimeInterval[] }>
  ): TimeInterval[] {
    if (hostSchedules.length === 0) return [];
    if (hostSchedules.length === 1) return hostSchedules[0].availableSlots;

    // Start with the first host's available slots
    let intersection: TimeInterval[] = [...hostSchedules[0].availableSlots];

    for (let i = 1; i < hostSchedules.length; i++) {
      const currentHostSlots = hostSchedules[i].availableSlots;
      const nextIntersection: TimeInterval[] = [];

      for (const slotA of intersection) {
        for (const slotB of currentHostSlots) {
          const overlapStart = new Date(Math.max(slotA.start.getTime(), slotB.start.getTime()));
          const overlapEnd = new Date(Math.min(slotA.end.getTime(), slotB.end.getTime()));

          // If there is a valid overlapping interval
          if (overlapStart.getTime() < overlapEnd.getTime()) {
            nextIntersection.push({
              start: overlapStart,
              end: overlapEnd,
            });
          }
        }
      }

      intersection = nextIntersection;
      if (intersection.length === 0) {
        break; // No common free time
      }
    }

    return intersection;
  }
}
