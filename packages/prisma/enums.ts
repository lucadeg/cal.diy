/**
 * Prisma Schema Enums.
 * Self-contained enum definitions matching schema.prisma.
 */

export enum SchedulingType {
  ROUND_ROBIN = "ROUND_ROBIN",
  COLLECTIVE = "COLLECTIVE",
  MANAGED = "MANAGED",
}

export enum PeriodType {
  UNLIMITED = "UNLIMITED",
  ROLLING = "ROLLING",
  ROLLING_WINDOW = "ROLLING_WINDOW",
  RANGE = "RANGE",
}

export enum UserPermissionRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum IdentityProvider {
  CAL = "CAL",
  GOOGLE = "GOOGLE",
  SAML = "SAML",
  AZUREAD = "AZUREAD",
  KEYCLOAK = "KEYCLOAK",
}

export enum MembershipRole {
  MEMBER = "MEMBER",
  ADMIN = "ADMIN",
  OWNER = "OWNER",
}

export enum BookingStatus {
  CANCELLED = "CANCELLED",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  PENDING = "PENDING",
  AWAITING_HOST = "AWAITING_HOST",
}

export enum EventTypeCustomInputType {
  TEXT = "TEXT",
  TEXT_LONG = "TEXT_LONG",
  NUMBER = "NUMBER",
  BOOL = "BOOL",
  RADIO = "RADIO",
  PHONE = "PHONE",
  SELECT = "SELECT",
  MULTITEXT = "MULTITEXT",
  CHECKBOX = "CHECKBOX",
}

export enum PaymentOption {
  ON_BOOKING = "ON_BOOKING",
  HOLD = "HOLD",
}

export enum WebhookTriggerEvents {
  BOOKING_CREATED = "BOOKING_CREATED",
  BOOKING_RESCHEDULED = "BOOKING_RESCHEDULED",
  BOOKING_CANCELLED = "BOOKING_CANCELLED",
  BOOKING_SUCCESSFUL = "BOOKING_SUCCESSFUL",
  BOOKING_REJECTED = "BOOKING_REJECTED",
  BOOKING_REQUESTED = "BOOKING_REQUESTED",
  FORM_SUBMITTED = "FORM_SUBMITTED",
  MEETING_ENDED = "MEETING_ENDED",
  MEETING_STARTED = "MEETING_STARTED",
  RECORDING_READY = "RECORDING_READY",
  INSTANT_MEETING = "INSTANT_MEETING",
}

export enum AppCategories {
  calendar = "calendar",
  messaging = "messaging",
  other = "other",
  payment = "payment",
  video = "video",
  web3 = "web3",
  automation = "automation",
  analytics = "analytics",
  conferencing = "conferencing",
  crm = "crm",
}

export enum TimeUnit {
  DAY = "DAY",
  MINUTES = "MINUTES",
}

export enum FeatureType {
  RELEASE = "RELEASE",
  EXPERIMENT = "EXPERIMENT",
  OPERATIONAL = "OPERATIONAL",
  KILL_SWITCH = "KILL_SWITCH",
  PERMISSION = "PERMISSION",
}

export enum RRResetInterval {
  NEVER = "NEVER",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
}

export enum RRTimestampBasis {
  BOOKING_CREATED = "BOOKING_CREATED",
  EVENT_START = "EVENT_START",
}

export enum ReminderType {
  PENDING_BOOKING_SUBJECT = "PENDING_BOOKING_SUBJECT",
  TIME_TO_EVENT_SUBJECT = "TIME_TO_EVENT_SUBJECT",
}

export enum AssignmentReasonEnum {
  ROUTING_FORM = "ROUTING_FORM",
  REASSIGNED = "REASSIGNED",
  ROUND_ROBIN = "ROUND_ROBIN",
  UNASSIGNED = "UNASSIGNED",
}

export enum CreationSource {
  API_V1 = "API_V1",
  API_V2 = "API_V2",
  WEBAPP = "WEBAPP",
}

export enum CancellationReasonRequirement {
  NEVER = "NEVER",
  ALWAYS = "ALWAYS",
  TIME_BASED = "TIME_BASED",
}

export enum OAuthClientType {
  PUBLIC = "PUBLIC",
  CONFIDENTIAL = "CONFIDENTIAL",
}

export enum OAuthClientStatus {
  ACTIVE = "ACTIVE",
  REVOKED = "REVOKED",
}

export enum AccessScope {
  READ_BOOKING = "READ_BOOKING",
  READ_PROFILE = "READ_PROFILE",
  WRITE_BOOKING = "WRITE_BOOKING",
  WRITE_PROFILE = "WRITE_PROFILE",
}

export enum RedirectType {
  CUSTOM_URL = "CUSTOM_URL",
  BOOKING_URL = "BOOKING_URL",
}

export enum SMSLockState {
  LOCKED = "LOCKED",
  UNLOCKED = "UNLOCKED",
  REVIEW_NEEDED = "REVIEW_NEEDED",
}

export enum AttributeType {
  TEXT = "TEXT",
  NUMBER = "NUMBER",
  SINGLE_SELECT = "SINGLE_SELECT",
  MULTI_SELECT = "MULTI_SELECT",
}

export enum WatchlistType {
  EMAIL = "EMAIL",
  DOMAIN = "DOMAIN",
}

export enum WatchlistAction {
  BLOCK = "BLOCK",
  FLAG = "FLAG",
}

export enum WatchlistSource {
  MANUAL = "MANUAL",
  SYSTEM = "SYSTEM",
}

export enum BookingReportReason {
  NOT_ATTENDED = "NOT_ATTENDED",
  HOST_ABSENT = "HOST_ABSENT",
  TECHNICAL_ISSUES = "TECHNICAL_ISSUES",
  WRONG_PERSON = "WRONG_PERSON",
  OTHER = "OTHER",
}

export enum BookingReportStatus {
  PENDING = "PENDING",
  RESOLVED = "RESOLVED",
}

export enum SystemReportStatus {
  PENDING = "PENDING",
  RESOLVED = "RESOLVED",
}

export enum WrongAssignmentReportStatus {
  PENDING = "PENDING",
  RESOLVED = "RESOLVED",
}

export enum BillingPeriod {
  MONTHLY = "MONTHLY",
  ANNUALLY = "ANNUALLY",
}

export enum BillingMode {
  SUBSCRIPTION = "SUBSCRIPTION",
  ONE_TIME = "ONE_TIME",
}

export enum FilterSegmentScope {
  USER = "USER",
  ORGANIZATION = "ORGANIZATION",
  TEAM = "TEAM",
}

export enum RoleType {
  SYSTEM = "SYSTEM",
  ORGANIZATION = "ORGANIZATION",
  TEAM = "TEAM",
}

export enum BookingAuditType {
  BOOKING = "BOOKING",
  ATTENDEE = "ATTENDEE",
  PAYMENT = "PAYMENT",
}

export enum BookingAuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  CANCEL = "CANCEL",
  DELETE = "DELETE",
}

export enum BookingAuditSource {
  SYSTEM = "SYSTEM",
  USER = "USER",
  EXTERNAL = "EXTERNAL",
}

export enum AuditActorType {
  USER = "USER",
  SYSTEM = "SYSTEM",
  EXTERNAL = "EXTERNAL",
}

export enum CreditUsageType {
  SMS = "SMS",
  WHATSAPP = "WHATSAPP",
}

export enum CreditType {
  MONTHLY = "MONTHLY",
  PAYG = "PAYG",
}

export enum PhoneNumberSubscriptionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  CANCELLED = "CANCELLED",
}

export enum SeatChangeType {
  ADD = "ADD",
  REMOVE = "REMOVE",
}

export enum ProrationStatus {
  PRORATED = "PRORATED",
  NOT_PRORATED = "NOT_PRORATED",
}

export enum CalendarCacheEventStatus {
  BUSY = "BUSY",
  FREE = "FREE",
}

export enum EventTypeAutoTranslatedField {
  TITLE = "TITLE",
  DESCRIPTION = "DESCRIPTION",
}
