import { z } from "zod";
import { WorkflowTriggerEvents, WorkflowActions, TimeUnit } from "@calcom/features/workflows";

export const ZWorkflowStepSchema = z.object({
  id: z.string(),
  stepNumber: z.number(),
  action: z.nativeEnum(WorkflowActions),
  sendTo: z.string().optional(),
  template: z.string().optional(),
  time: z.number().optional(),
  timeUnit: z.nativeEnum(TimeUnit).optional(),
});

export const ZCreateWorkflowInputSchema = z.object({
  name: z.string().min(1),
  teamId: z.number().optional(),
  trigger: z.nativeEnum(WorkflowTriggerEvents),
  time: z.number().optional(),
  timeUnit: z.nativeEnum(TimeUnit).optional(),
  steps: z.array(ZWorkflowStepSchema),
  isActive: z.boolean().default(true),
  eventTypeId: z.number().optional(),
});

export type TCreateWorkflowInputSchema = z.infer<typeof ZCreateWorkflowInputSchema>;
