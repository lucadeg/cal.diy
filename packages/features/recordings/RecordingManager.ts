import { prisma } from "@calcom/prisma";
import type { MeetingRecording } from "./types";

export class RecordingManager {
  static async listRecordingsForBooking(bookingUid: string): Promise<MeetingRecording[]> {
    const booking = await prisma.booking.findUnique({
      where: { uid: bookingUid },
      select: { metadata: true },
    });

    const metadata = (booking?.metadata as Record<string, unknown>) || {};
    return (metadata.recordings as MeetingRecording[]) || [];
  }

  static async registerRecording(bookingUid: string, recording: MeetingRecording): Promise<MeetingRecording> {
    const booking = await prisma.booking.findUnique({
      where: { uid: bookingUid },
      select: { metadata: true },
    });

    const metadata = (booking?.metadata as Record<string, unknown>) || {};
    const existingRecordings = (metadata.recordings as MeetingRecording[]) || [];
    const updated = [...existingRecordings, recording];

    await prisma.booking.update({
      where: { uid: bookingUid },
      data: {
        metadata: {
          ...metadata,
          recordings: updated,
        },
      },
    });

    return recording;
  }
}
