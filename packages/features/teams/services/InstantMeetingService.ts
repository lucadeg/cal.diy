import { prisma } from "@calcom/prisma";


export interface CreateInstantMeetingSessionInput {
  eventTypeId: number;
  bookerEmail: string;
  bookerName: string;
}

export interface InstantMeetingSession {
  token: string;
  expiresAt: Date;
  eventTypeId: number;
  assignedUserId: number | null;
  videoCallUrl: string | null;
  status: "WAITING_FOR_HOST" | "CONNECTED" | "EXPIRED";
}

export class InstantMeetingService {
  /**
   * Create an instant meeting request session and generate an invitation token.
   */
  static async createSession(input: CreateInstantMeetingSessionInput): Promise<InstantMeetingSession> {
    const token = Array.from(globalThis.crypto.getRandomValues(new Uint8Array(24)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minute timeout

    const dbToken = await prisma.instantMeetingToken.create({
      data: {
        token,
        expires: expiresAt,
        teamId: (await prisma.eventType.findUnique({ where: { id: input.eventTypeId }, select: { teamId: true } }))?.teamId || 0,
      },
    });

    return {
      token: dbToken.token,
      expiresAt: dbToken.expires,
      eventTypeId: input.eventTypeId,
      assignedUserId: null,
      videoCallUrl: null,
      status: "WAITING_FOR_HOST",
    };
  }

  /**
   * Host accepts the instant meeting and connects to the video room.
   */
  static async acceptInstantMeeting(token: string, hostUserId: number) {
    const session = await prisma.instantMeetingToken.findUnique({
      where: { token },
    });

    if (!session || session.expires < new Date()) {
      throw new Error("Instant meeting session expired or not found");
    }

    const videoCallUrl = `https://app.cal.com/video/${token}`;

    return {
      token,
      assignedUserId: hostUserId,
      videoCallUrl,
      status: "CONNECTED" as const,
    };
  }
}
