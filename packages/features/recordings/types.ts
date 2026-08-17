export interface MeetingRecording {
  id: string;
  bookingUid: string;
  roomName: string;
  downloadUrl: string;
  playbackUrl: string;
  durationSeconds: number;
  status: "PROCESSING" | "READY" | "FAILED";
  transcriptUrl?: string;
  createdAt: Date;
}
