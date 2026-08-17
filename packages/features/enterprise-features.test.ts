import { describe, it, expect } from "vitest";
import { CollectiveSchedulingService } from "./teams/services/CollectiveSchedulingService";
import { RoutingRuleEvaluator, type RoutingFormDefinition } from "./routing-forms";
import { WorkflowTriggerEvents, WorkflowActions } from "./workflows";

describe("Enterprise Feature Engine Suite", () => {
  describe("Collective Scheduling Slot Intersection", () => {
    it("should compute exact free time intersection between multiple hosts", () => {
      const host1Slots = [
        { start: new Date("2026-08-20T09:00:00Z"), end: new Date("2026-08-20T12:00:00Z") },
        { start: new Date("2026-08-20T14:00:00Z"), end: new Date("2026-08-20T17:00:00Z") },
      ];

      const host2Slots = [
        { start: new Date("2026-08-20T10:00:00Z"), end: new Date("2026-08-20T11:30:00Z") },
        { start: new Date("2026-08-20T15:00:00Z"), end: new Date("2026-08-20T18:00:00Z") },
      ];

      const result = CollectiveSchedulingService.getCollectiveSlots([
        { userId: 1, availableSlots: host1Slots },
        { userId: 2, availableSlots: host2Slots },
      ]);

      expect(result).toHaveLength(2);
      expect(result[0].start.toISOString()).toBe("2026-08-20T10:00:00.000Z");
      expect(result[0].end.toISOString()).toBe("2026-08-20T11:30:00.000Z");
      expect(result[1].start.toISOString()).toBe("2026-08-20T15:00:00.000Z");
      expect(result[1].end.toISOString()).toBe("2026-08-20T17:00:00.000Z");
    });
  });

  describe("Routing Rule Evaluator", () => {
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

    it("should route enterprise lead to enterprise round-robin event type", () => {
      const response = {
        company_size: "Enterprise",
        budget: 25000,
      };

      const result = RoutingRuleEvaluator.evaluate(mockForm, response);
      expect(result.matchedRuleId).toBe("rule-enterprise");
      expect(result.actionValue).toBe("enterprise-round-robin");
    });

    it("should route small lead to fallback self-serve booking", () => {
      const response = {
        company_size: "Small (1-10)",
        budget: 500,
      };

      const result = RoutingRuleEvaluator.evaluate(mockForm, response);
      expect(result.matchedRuleId).toBeNull();
      expect(result.actionValue).toBe("self-serve-booking");
    });
  });

  describe("Workflows Enums & Structure", () => {
    it("should declare valid triggers and actions", () => {
      expect(WorkflowTriggerEvents.BEFORE_EVENT).toBe("BEFORE_EVENT");
      expect(WorkflowTriggerEvents.EVENT_CANCELLED).toBe("EVENT_CANCELLED");
      expect(WorkflowActions.SMS_ATTENDEE).toBe("SMS_ATTENDEE");
      expect(WorkflowActions.EMAIL_HOST).toBe("EMAIL_HOST");
    });
  });
});
