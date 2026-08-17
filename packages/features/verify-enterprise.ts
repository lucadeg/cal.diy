// Pure TypeScript validation runner without external heavy dependencies
import { CollectiveSchedulingService } from "./teams/services/CollectiveSchedulingService.ts";
import { RoutingRuleEvaluator, type RoutingFormDefinition } from "./routing-forms/index.ts";
import { WorkflowTriggerEvents, WorkflowActions } from "./workflows/index.ts";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log("== Running Cal.diy Enterprise Features Verification ==");

// 1. Test Collective Scheduling
console.log("1. Testing Collective Scheduling Slot Intersection...");
const host1Slots = [
  { start: new Date("2026-08-20T09:00:00Z"), end: new Date("2026-08-20T12:00:00Z") },
  { start: new Date("2026-08-20T14:00:00Z"), end: new Date("2026-08-20T17:00:00Z") },
];

const host2Slots = [
  { start: new Date("2026-08-20T10:00:00Z"), end: new Date("2026-08-20T11:30:00Z") },
  { start: new Date("2026-08-20T15:00:00Z"), end: new Date("2026-08-20T18:00:00Z") },
];

const collectiveResult = CollectiveSchedulingService.getCollectiveSlots([
  { userId: 1, availableSlots: host1Slots },
  { userId: 2, availableSlots: host2Slots },
]);

assert(collectiveResult.length === 2, `Expected 2 slots, got ${collectiveResult.length}`);
assert(collectiveResult[0].start.toISOString() === "2026-08-20T10:00:00.000Z", "Slot 0 start mismatch");
assert(collectiveResult[0].end.toISOString() === "2026-08-20T11:30:00.000Z", "Slot 0 end mismatch");
assert(collectiveResult[1].start.toISOString() === "2026-08-20T15:00:00.000Z", "Slot 1 start mismatch");
assert(collectiveResult[1].end.toISOString() === "2026-08-20T17:00:00.000Z", "Slot 1 end mismatch");
console.log("  [PASS] Collective Scheduling Slot Intersection");

// 2. Test Routing Rule Evaluator
console.log("2. Testing Routing Rule Evaluator...");
const mockForm: RoutingFormDefinition = {
  id: "form-1",
  name: "Lead Qualification Form",
  userId: 1,
  fields: [
    { id: "company_size", label: "Company Size", type: "select", required: true },
    { id: "budget", label: "Budget", type: "number", required: true },
  ],
  rules: [
    {
      id: "rule-enterprise",
      name: "Enterprise Route",
      conditions: [
        { fieldId: "company_size", operator: "EQUAL", value: "Enterprise" },
        { fieldId: "budget", operator: "GREATER_THAN", value: 10000 },
      ],
      actionType: "EVENT_TYPE_REDIRECT",
      actionValue: "enterprise-round-robin",
    },
  ],
  fallbackAction: {
    actionType: "EVENT_TYPE_REDIRECT",
    actionValue: "self-serve-booking",
  },
  createdAt: new Date(),
};

const enterpriseRes = RoutingRuleEvaluator.evaluate(mockForm, {
  company_size: "Enterprise",
  budget: 25000,
});
assert(enterpriseRes.matchedRuleId === "rule-enterprise", "Enterprise routing rule failed");
assert(enterpriseRes.actionValue === "enterprise-round-robin", "Enterprise target mismatch");
console.log("  [PASS] Enterprise Route Matching");

const fallbackRes = RoutingRuleEvaluator.evaluate(mockForm, {
  company_size: "Small (1-10)",
  budget: 500,
});
assert(fallbackRes.matchedRuleId === null, "Fallback matched a rule unexpectedly");
assert(fallbackRes.actionValue === "self-serve-booking", "Fallback target mismatch");
console.log("  [PASS] Fallback Self-Serve Route Matching");

// 3. Test Workflows Enums
console.log("3. Testing Workflows Enums...");
assert(WorkflowTriggerEvents.BEFORE_EVENT === "BEFORE_EVENT", "Trigger enum mismatch");
assert(WorkflowActions.SMS_ATTENDEE === "SMS_ATTENDEE", "Action enum mismatch");
console.log("  [PASS] Workflows Enums and Schema");

console.log("\n>>> ALL ENTERPRISE SUITE VERIFICATIONS PASSED SUCCESSFULLY! <<<");
