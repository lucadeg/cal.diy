import { prisma } from "@calcom/prisma";
import type { WorkflowDefinition, WorkflowStep } from "./types";


export class WorkflowRepository {
  /**
   * List workflows for a user or team
   */
  static async listWorkflows(userId: number, teamId?: number): Promise<WorkflowDefinition[]> {
    // Stored in app/feature json or metadata tables
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { metadata: true },
    });

    const metadata = (user?.metadata as Record<string, unknown>) || {};
    const workflows = (metadata.workflows as WorkflowDefinition[]) || [];

    if (teamId) {
      return workflows.filter((w) => w.teamId === teamId);
    }
    return workflows;
  }

  static async getWorkflow(userId: number, workflowId: string): Promise<WorkflowDefinition | null> {
    const workflows = await this.listWorkflows(userId);
    return workflows.find((w) => w.id === workflowId) || null;
  }

  static async saveWorkflow(userId: number, workflow: Omit<WorkflowDefinition, "id"> & { id?: string }): Promise<WorkflowDefinition> {
    const id = workflow.id || globalThis.crypto.randomUUID();
    const fullWorkflow: WorkflowDefinition = {
      ...workflow,
      id,
      userId,
    };

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { metadata: true },
    });

    const metadata = (user?.metadata as Record<string, unknown>) || {};
    const existingWorkflows = ((metadata.workflows as WorkflowDefinition[]) || []).filter((w) => w.id !== id);
    const updatedWorkflows = [...existingWorkflows, fullWorkflow];

    await prisma.user.update({
      where: { id: userId },
      data: {
        metadata: {
          ...metadata,
          workflows: updatedWorkflows,
        },
      },
    });

    return fullWorkflow;
  }

  static async deleteWorkflow(userId: number, workflowId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { metadata: true },
    });

    const metadata = (user?.metadata as Record<string, unknown>) || {};
    const existingWorkflows = (metadata.workflows as WorkflowDefinition[]) || [];
    const updatedWorkflows = existingWorkflows.filter((w) => w.id !== workflowId);

    await prisma.user.update({
      where: { id: userId },
      data: {
        metadata: {
          ...metadata,
          workflows: updatedWorkflows,
        },
      },
    });

    return true;
  }
}
