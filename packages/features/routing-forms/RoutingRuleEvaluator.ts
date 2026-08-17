import type { RoutingFormDefinition, RoutingRuleCondition, RoutingActionType } from "./types";

export interface RoutingEvaluationResult {
  matchedRuleId: string | null;
  actionType: RoutingActionType;
  actionValue: string;
}

export class RoutingRuleEvaluator {
  /**
   * Evaluate user submitted form responses against conditional routing rules.
   */
  static evaluate(form: RoutingFormDefinition, responses: Record<string, string | number | string[]>): RoutingEvaluationResult {
    for (const rule of form.rules) {
      const isMatch = rule.conditions.every((cond) => this.evaluateCondition(cond, responses[cond.fieldId]));
      if (isMatch) {
        return {
          matchedRuleId: rule.id,
          actionType: rule.actionType,
          actionValue: rule.actionValue,
        };
      }
    }

    // Fallback if no rules match
    return {
      matchedRuleId: null,
      actionType: form.fallbackAction.actionType,
      actionValue: form.fallbackAction.actionValue,
    };
  }

  private static evaluateCondition(cond: RoutingRuleCondition, actualValue: string | number | string[] | undefined): boolean {
    if (actualValue === undefined || actualValue === null) return false;

    switch (cond.operator) {
      case "EQUAL":
        return String(actualValue).toLowerCase().trim() === String(cond.value).toLowerCase().trim();

      case "NOT_EQUAL":
        return String(actualValue).toLowerCase().trim() !== String(cond.value).toLowerCase().trim();

      case "CONTAINS":
        return String(actualValue).toLowerCase().includes(String(cond.value).toLowerCase());

      case "ANY_OF": {
        const allowed = Array.isArray(cond.value) ? cond.value.map((v) => String(v).toLowerCase()) : [String(cond.value).toLowerCase()];
        if (Array.isArray(actualValue)) {
          return actualValue.some((v) => allowed.includes(String(v).toLowerCase()));
        }
        return allowed.includes(String(actualValue).toLowerCase());
      }

      case "GREATER_THAN":
        return Number(actualValue) > Number(cond.value);

      case "LESS_THAN":
        return Number(actualValue) < Number(cond.value);

      default:
        return false;
    }
  }
}
