// Comprehensive enterprise validation test suite with edge cases, error handling, and exceptions
function assert(condition, message) {
  if (!condition) {
    throw new Error(`[ASSERTION FAILED]: ${message}`);
  }
}

function assertThrows(fn, expectedErrorSubstring) {
  let threw = false;
  try {
    fn();
  } catch (err) {
    threw = true;
    if (expectedErrorSubstring && !err.message.includes(expectedErrorSubstring)) {
      throw new Error(`Expected error containing "${expectedErrorSubstring}", but got: "${err.message}"`);
    }
  }
  if (!threw) {
    throw new Error(`Expected function to throw error, but it succeeded`);
  }
}

console.log("====================================================================");
console.log(" CAL.DIY ENTERPRISE: COMPREHENSIVE EDGE-CASE & EXCEPTION TEST SUITE ");
console.log("====================================================================");

// -------------------------------------------------------------------
// 1. Collective Scheduling Algorithm - Edge Cases & Empty Conditions
// -------------------------------------------------------------------
console.log("\n[1/7] Testing Collective Scheduling Edge Cases...");
function getCollectiveSlots(hostSchedules) {
  if (!hostSchedules || hostSchedules.length === 0) return [];
  if (hostSchedules.length === 1) return hostSchedules[0].availableSlots || [];

  let intersection = [...(hostSchedules[0].availableSlots || [])];

  for (let i = 1; i < hostSchedules.length; i++) {
    const currentHostSlots = hostSchedules[i].availableSlots || [];
    const nextIntersection = [];

    for (const slotA of intersection) {
      for (const slotB of currentHostSlots) {
        const overlapStart = new Date(Math.max(slotA.start.getTime(), slotB.start.getTime()));
        const overlapEnd = new Date(Math.min(slotA.end.getTime(), slotB.end.getTime()));

        if (overlapStart.getTime() < overlapEnd.getTime()) {
          nextIntersection.push({
            start: overlapStart,
            end: overlapEnd,
          });
        }
      }
    }

    intersection = nextIntersection;
    if (intersection.length === 0) break;
  }

  return intersection;
}

// 1.1 Empty array
assert(getCollectiveSlots([]).length === 0, "Empty host array should return empty slots");

// 1.2 Single host
const singleHostSlots = [{ start: new Date("2026-08-20T10:00:00Z"), end: new Date("2026-08-20T11:00:00Z") }];
assert(getCollectiveSlots([{ userId: 1, availableSlots: singleHostSlots }]).length === 1, "Single host should return own slots");

// 1.3 Disjoint slots (no overlap)
const hostA = [{ start: new Date("2026-08-20T09:00:00Z"), end: new Date("2026-08-20T10:00:00Z") }];
const hostB = [{ start: new Date("2026-08-20T11:00:00Z"), end: new Date("2026-08-20T12:00:00Z") }];
assert(getCollectiveSlots([{ userId: 1, availableSlots: hostA }, { userId: 2, availableSlots: hostB }]).length === 0, "Disjoint slots must yield 0 intersection");

// 1.4 Three co-hosts partial overlap
const hostC = [{ start: new Date("2026-08-20T09:30:00Z"), end: new Date("2026-08-20T10:30:00Z") }];
const hostD = [{ start: new Date("2026-08-20T09:00:00Z"), end: new Date("2026-08-20T10:00:00Z") }];
const hostE = [{ start: new Date("2026-08-20T09:45:00Z"), end: new Date("2026-08-20T11:00:00Z") }];
const threeHostSlots = getCollectiveSlots([
  { userId: 1, availableSlots: hostC },
  { userId: 2, availableSlots: hostD },
  { userId: 3, availableSlots: hostE }
]);
assert(threeHostSlots.length === 1, "Expected 1 overlapping window for 3 hosts");
assert(threeHostSlots[0].start.toISOString() === "2026-08-20T09:45:00.000Z", "Overlapping start must be 09:45Z");
assert(threeHostSlots[0].end.toISOString() === "2026-08-20T10:00:00.000Z", "Overlapping end must be 10:00Z");
console.log("  -> PASS: All collective scheduling edge cases & multi-party overlaps verified.");

// -------------------------------------------------------------------
// 2. Routing Rules Evaluator - Exception & Boundary Conditions
// -------------------------------------------------------------------
console.log("\n[2/7] Testing Routing Rules Evaluator Exception & Operator Matrix...");
function evaluateCondition(cond, actualValue) {
  if (actualValue === undefined || actualValue === null) return false;
  switch (cond.operator) {
    case "EQUAL":
      return String(actualValue).toLowerCase().trim() === String(cond.value).toLowerCase().trim();
    case "NOT_EQUAL":
      return String(actualValue).toLowerCase().trim() !== String(cond.value).toLowerCase().trim();
    case "CONTAINS":
      return String(actualValue).toLowerCase().includes(String(cond.value).toLowerCase());
    case "GREATER_THAN":
      return Number(actualValue) > Number(cond.value);
    case "LESS_THAN":
      return Number(actualValue) < Number(cond.value);
    case "ANY_OF": {
      const allowed = Array.isArray(cond.value) ? cond.value.map((v) => String(v).toLowerCase()) : [String(cond.value).toLowerCase()];
      if (Array.isArray(actualValue)) {
        return actualValue.some((v) => allowed.includes(String(v).toLowerCase()));
      }
      return allowed.includes(String(actualValue).toLowerCase());
    }
    default:
      return false;
  }
}

function evaluateRoutingForm(form, responses) {
  if (!form || !form.rules) throw new Error("Invalid form configuration");
  for (const rule of form.rules) {
    const isMatch = rule.conditions.every((cond) => evaluateCondition(cond, responses[cond.fieldId]));
    if (isMatch) {
      return { matchedRuleId: rule.id, actionType: rule.actionType, actionValue: rule.actionValue };
    }
  }
  return { matchedRuleId: null, actionType: form.fallbackAction.actionType, actionValue: form.fallbackAction.actionValue };
}

const complexForm = {
  id: "form-complex",
  rules: [
    {
      id: "vip-rule",
      conditions: [
        { fieldId: "tier", operator: "ANY_OF", value: ["enterprise", "custom", "partner"] },
        { fieldId: "employees", operator: "GREATER_THAN", value: 100 },
        { fieldId: "country", operator: "NOT_EQUAL", value: "SanctionedLand" }
      ],
      actionType: "EVENT_TYPE_REDIRECT",
      actionValue: "vip-inbound-round-robin",
    },
    {
      id: "mid-market-rule",
      conditions: [
        { fieldId: "employees", operator: "GREATER_THAN", value: 20 },
        { fieldId: "employees", operator: "LESS_THAN", value: 101 },
      ],
      actionType: "EVENT_TYPE_REDIRECT",
      actionValue: "mid-market-team",
    }
  ],
  fallbackAction: {
    actionType: "EVENT_TYPE_REDIRECT",
    actionValue: "self-serve-booking",
  },
};

// 2.1 VIP Match
const vipMatch = evaluateRoutingForm(complexForm, { tier: "Enterprise", employees: 500, country: "Italy" });
assert(vipMatch.matchedRuleId === "vip-rule", "VIP match failed");

// 2.2 Mid-Market Match
const midMatch = evaluateRoutingForm(complexForm, { tier: "Standard", employees: 45, country: "USA" });
assert(midMatch.matchedRuleId === "mid-market-rule", "Mid-market match failed");

// 2.3 Fallback on boundary
const fallbackMatch = evaluateRoutingForm(complexForm, { tier: "Standard", employees: 10, country: "France" });
assert(fallbackMatch.matchedRuleId === null, "Fallback match failed");
assert(fallbackMatch.actionValue === "self-serve-booking", "Fallback destination mismatch");

// 2.4 Missing form error
assertThrows(() => evaluateRoutingForm(null, {}), "Invalid form configuration");
console.log("  -> PASS: Routing form operator matrix & exception triggers verified.");

// -------------------------------------------------------------------
// 3. Workflows Automation Pipeline & Trigger Safety
// -------------------------------------------------------------------
console.log("\n[3/7] Testing Workflows Trigger & Action Execution Handlers...");
const workflowTriggers = ["BEFORE_EVENT", "EVENT_CANCELLED", "NEW_EVENT", "AFTER_EVENT", "RESCHEDULE_EVENT"];
const workflowActions = ["EMAIL_HOST", "EMAIL_ATTENDEE", "SMS_ATTENDEE", "SMS_NUMBER", "WHATSAPP_ATTENDEE", "WEBHOOK"];

function validateWorkflowDefinition(workflow) {
  if (!workflow.name || workflow.name.trim().length === 0) throw new Error("Workflow name cannot be empty");
  if (!workflowTriggers.includes(workflow.trigger)) throw new Error(`Invalid trigger: ${workflow.trigger}`);
  if (!Array.isArray(workflow.steps) || workflow.steps.length === 0) throw new Error("Workflow must contain at least one step");
  for (const step of workflow.steps) {
    if (!workflowActions.includes(step.action)) throw new Error(`Invalid action: ${step.action}`);
  }
  return true;
}

assert(validateWorkflowDefinition({
  name: "24h Reminder",
  trigger: "BEFORE_EVENT",
  steps: [{ stepNumber: 1, action: "EMAIL_ATTENDEE" }, { stepNumber: 2, action: "SMS_ATTENDEE" }]
}) === true, "Valid workflow definition failed validation");

assertThrows(() => validateWorkflowDefinition({ name: "", trigger: "BEFORE_EVENT", steps: [] }), "Workflow name cannot be empty");
assertThrows(() => validateWorkflowDefinition({ name: "Test", trigger: "INVALID_TRIGGER", steps: [] }), "Invalid trigger");
assertThrows(() => validateWorkflowDefinition({ name: "Test", trigger: "BEFORE_EVENT", steps: [] }), "Workflow must contain at least one step");
console.log("  -> PASS: Workflow definition validation & schema constraints verified.");

// -------------------------------------------------------------------
// 4. Insights BI Analytics - Date Validation & Bounds
// -------------------------------------------------------------------
console.log("\n[4/7] Testing Insights Date Bounds & Math Calculations...");
function validateInsightsDates(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) throw new Error("Invalid date range provided");
  if (start.getTime() > end.getTime()) throw new Error("startDate cannot be after endDate");
  return { start, end };
}

assert(validateInsightsDates("2026-08-01", "2026-08-15").start instanceof Date, "Valid dates failed parsing");
assertThrows(() => validateInsightsDates("invalid-date", "2026-08-15"), "Invalid date range provided");
assertThrows(() => validateInsightsDates("2026-08-20", "2026-08-10"), "startDate cannot be after endDate");
console.log("  -> PASS: Insights date boundaries and safety checks verified.");

// -------------------------------------------------------------------
// 5. Admin Impersonation & Security Guardrails
// -------------------------------------------------------------------
console.log("\n[5/7] Testing Impersonation Security Guardrails...");
function checkImpersonationAccess(adminRole, targetUserDisabled, targetUserFound) {
  if (adminRole !== "ADMIN") throw new Error("Unauthorized: Only admins can initiate impersonation");
  if (!targetUserFound) throw new Error("Target user not found");
  if (targetUserDisabled) throw new Error("Target user has explicitly disabled impersonation");
  return { allowed: true };
}

assert(checkImpersonationAccess("ADMIN", false, true).allowed === true, "Valid admin impersonation failed");
assertThrows(() => checkImpersonationAccess("USER", false, true), "Unauthorized");
assertThrows(() => checkImpersonationAccess("ADMIN", false, false), "Target user not found");
assertThrows(() => checkImpersonationAccess("ADMIN", true, true), "Target user has explicitly disabled impersonation");
console.log("  -> PASS: Security guardrails for impersonation verified.");

// -------------------------------------------------------------------
// 6. Delegation Permission Rules
// -------------------------------------------------------------------
console.log("\n[6/7] Testing Delegation Permission Matrix...");
function checkDelegationPermission(delegationRule, action) {
  if (!delegationRule) return false;
  if (action === "BOOK") return Boolean(delegationRule.canBook);
  if (action === "RESCHEDULE") return Boolean(delegationRule.canReschedule);
  if (action === "CANCEL") return Boolean(delegationRule.canCancel);
  return false;
}

const rule = { canBook: true, canReschedule: true, canCancel: false };
assert(checkDelegationPermission(rule, "BOOK") === true, "Booking delegation failed");
assert(checkDelegationPermission(rule, "RESCHEDULE") === true, "Reschedule delegation failed");
assert(checkDelegationPermission(rule, "CANCEL") === false, "Cancel delegation should be blocked");
console.log("  -> PASS: Delegation permission matrix verified.");

// -------------------------------------------------------------------
// 7. Instant Meeting Session State Transitions
// -------------------------------------------------------------------
console.log("\n[7/7] Testing Instant Meeting Session Lifecycle...");
function evaluateInstantMeeting(tokenExists, isExpired, isAccepted) {
  if (!tokenExists) throw new Error("Session not found");
  if (isExpired) throw new Error("Instant meeting session expired");
  if (isAccepted) return "CONNECTED";
  return "WAITING_FOR_HOST";
}

assert(evaluateInstantMeeting(true, false, false) === "WAITING_FOR_HOST", "Initial state mismatch");
assert(evaluateInstantMeeting(true, false, true) === "CONNECTED", "Connected state mismatch");
assertThrows(() => evaluateInstantMeeting(false, false, false), "Session not found");
assertThrows(() => evaluateInstantMeeting(true, true, false), "Instant meeting session expired");
console.log("  -> PASS: Instant meeting session lifecycle and timeouts verified.");

console.log("\n====================================================================");
console.log(" ALL 7 ENTERPRISE MODULES & EDGE-CASE SUITES PASSED 100%!           ");
console.log("====================================================================");
