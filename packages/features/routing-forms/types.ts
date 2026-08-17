export type FieldType = "text" | "number" | "select" | "multiselect" | "radio" | "email" | "phone";

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: Array<{ label: string; value: string }>;
}

export type RoutingRuleOperator = "EQUAL" | "NOT_EQUAL" | "CONTAINS" | "ANY_OF" | "GREATER_THAN" | "LESS_THAN";

export interface RoutingRuleCondition {
  fieldId: string;
  operator: RoutingRuleOperator;
  value: string | string[] | number;
}

export type RoutingActionType = "EVENT_TYPE_REDIRECT" | "EXTERNAL_URL_REDIRECT" | "CUSTOM_MESSAGE";

export interface RoutingRule {
  id: string;
  name: string;
  conditions: RoutingRuleCondition[];
  actionType: RoutingActionType;
  actionValue: string; // Event type slug, external URL, or text message
}

export interface RoutingFormDefinition {
  id: string;
  name: string;
  description?: string;
  userId: number;
  teamId?: number;
  fields: FormField[];
  rules: RoutingRule[];
  fallbackAction: {
    actionType: RoutingActionType;
    actionValue: string;
  };
  createdAt: Date;
}
