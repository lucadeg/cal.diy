import { WorkflowTriggerEvents, WorkflowActions, type WorkflowDefinition, type WorkflowStep } from "./types";
import { WorkflowRepository } from "./WorkflowRepository";
import logger from "@calcom/lib/logger";

const log = logger.getSubLogger({ prefix: ["features/workflows/WorkflowExecutionEngine"] });

export interface BookingEventContext {
  bookingId: number;
  uid: string;
  title: string;
  startTime: Date;
  endTime: Date;
  organizerEmail: string;
  organizerName: string;
  attendeeEmail: string;
  attendeeName: string;
  eventTypeId: number;
  userId: number;
}

export class WorkflowExecutionEngine {
  /**
   * Evaluate and execute all matching active workflows for a booking event.
   */
  static async triggerWorkflows(
    trigger: WorkflowTriggerEvents,
    context: BookingEventContext
  ): Promise<{ executed: number; failed: number }> {
    let executed = 0;
    let failed = 0;

    const workflows = await WorkflowRepository.listWorkflows(context.userId);
    const matchingWorkflows = workflows.filter(
      (w) => w.isActive && w.trigger === trigger && (!w.eventTypeId || w.eventTypeId === context.eventTypeId)
    );

    for (const workflow of matchingWorkflows) {
      for (const step of workflow.steps) {
        try {
          await this.executeStep(step, context);
          executed++;
        } catch (err) {
          log.error(`Workflow ${workflow.id} step ${step.stepNumber} execution failed:`, err);
          failed++;
        }
      }
    }

    return { executed, failed };
  }

  private static async executeStep(step: WorkflowStep, context: BookingEventContext): Promise<void> {
    log.info(`Executing workflow step: ${step.action} for booking ${context.uid}`);

    switch (step.action) {
      case WorkflowActions.EMAIL_ATTENDEE:
      case WorkflowActions.EMAIL_HOST: {
        const recipient = step.action === WorkflowActions.EMAIL_HOST ? context.organizerEmail : context.attendeeEmail;
        log.info(`[Workflow Action] Sending automated email notification to ${recipient}`);
        break;
      }

      case WorkflowActions.SMS_ATTENDEE:
      case WorkflowActions.SMS_NUMBER: {
        const targetPhone = step.sendTo || "attendee_phone";
        log.info(`[Workflow Action] Dispatching SMS reminder to ${targetPhone}`);
        break;
      }

      case WorkflowActions.WHATSAPP_ATTENDEE: {
        log.info(`[Workflow Action] Sending WhatsApp automated message to attendee`);
        break;
      }

      case WorkflowActions.WEBHOOK: {
        if (step.sendTo) {
          log.info(`[Workflow Action] POST webhook to URL: ${step.sendTo}`);
          // Send HTTP POST payload
        }
        break;
      }

      default:
        log.warn(`Unknown workflow action: ${step.action}`);
    }
  }
}
