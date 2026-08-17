export enum WorkflowTriggerEvents {
  BEFORE_EVENT = "BEFORE_EVENT",
  EVENT_CANCELLED = "EVENT_CANCELLED",
  NEW_EVENT = "NEW_EVENT",
  AFTER_EVENT = "AFTER_EVENT",
  RESCHEDULE_EVENT = "RESCHEDULE_EVENT",
}

export enum WorkflowActions {
  EMAIL_HOST = "EMAIL_HOST",
  EMAIL_ATTENDEE = "EMAIL_ATTENDEE",
  SMS_ATTENDEE = "SMS_ATTENDEE",
  SMS_NUMBER = "SMS_NUMBER",
  WHATSAPP_ATTENDEE = "WHATSAPP_ATTENDEE",
  WHATSAPP_NUMBER = "WHATSAPP_NUMBER",
  WEBHOOK = "WEBHOOK",
}

export enum TimeUnit {
  MINUTE = "MINUTE",
  HOUR = "HOUR",
  DAY = "DAY",
}

export interface WorkflowStep {
  id: string;
  stepNumber: number;
  action: WorkflowActions;
  sendTo?: string;
  template?: string;
  time?: number;
  timeUnit?: TimeUnit;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  userId: number;
  teamId?: number;
  trigger: WorkflowTriggerEvents;
  time?: number;
  timeUnit?: TimeUnit;
  steps: WorkflowStep[];
  isActive: boolean;
  eventTypeId?: number;
}
