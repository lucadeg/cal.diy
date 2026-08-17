import { z } from "zod";

export const ZFormFieldSchema = z.object({
  id: z.string(),
  label: z.string().min(1),
  type: z.enum(["text", "number", "select", "multiselect", "radio", "email", "phone"]),
  required: z.boolean(),
  options: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
});

export const ZRoutingRuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  conditions: z.array(
    z.object({
      fieldId: z.string(),
      operator: z.enum(["EQUAL", "NOT_EQUAL", "CONTAINS", "ANY_OF", "GREATER_THAN", "LESS_THAN"]),
      value: z.union([z.string(), z.number(), z.array(z.string())]),
    })
  ),
  actionType: z.enum(["EVENT_TYPE_REDIRECT", "EXTERNAL_URL_REDIRECT", "CUSTOM_MESSAGE"]),
  actionValue: z.string(),
});

export const ZCreateRoutingFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  teamId: z.number().optional(),
  fields: z.array(ZFormFieldSchema),
  rules: z.array(ZRoutingRuleSchema),
  fallbackAction: z.object({
    actionType: z.enum(["EVENT_TYPE_REDIRECT", "EXTERNAL_URL_REDIRECT", "CUSTOM_MESSAGE"]),
    actionValue: z.string(),
  }),
});

export type TCreateRoutingFormSchema = z.infer<typeof ZCreateRoutingFormSchema>;
