import { prisma } from "@calcom/prisma";
import type { RoutingFormDefinition } from "./types";


export class RoutingFormRepository {
  static async listForms(userId: number, teamId?: number): Promise<RoutingFormDefinition[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { metadata: true },
    });

    const metadata = (user?.metadata as Record<string, unknown>) || {};
    const forms = (metadata.routingForms as RoutingFormDefinition[]) || [];

    if (teamId) {
      return forms.filter((f) => f.teamId === teamId);
    }
    return forms;
  }

  static async getForm(formId: string): Promise<RoutingFormDefinition | null> {
    // Search across user metadata or specific form tables
    const users = await prisma.user.findMany({
      where: {
        metadata: {
          path: ["routingForms"],
          array_contains: [{ id: formId }],
        },
      },
      select: { metadata: true },
    });

    for (const user of users) {
      const metadata = (user.metadata as Record<string, unknown>) || {};
      const forms = (metadata.routingForms as RoutingFormDefinition[]) || [];
      const match = forms.find((f) => f.id === formId);
      if (match) return match;
    }

    return null;
  }

  static async saveForm(userId: number, form: Omit<RoutingFormDefinition, "id" | "createdAt"> & { id?: string }): Promise<RoutingFormDefinition> {
    const id = form.id || globalThis.crypto.randomUUID();
    const fullForm: RoutingFormDefinition = {
      ...form,
      id,
      userId,
      createdAt: new Date(),
    };

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { metadata: true },
    });

    const metadata = (user?.metadata as Record<string, unknown>) || {};
    const existingForms = ((metadata.routingForms as RoutingFormDefinition[]) || []).filter((f) => f.id !== id);
    const updatedForms = [...existingForms, fullForm];

    await prisma.user.update({
      where: { id: userId },
      data: {
        metadata: {
          ...metadata,
          routingForms: updatedForms,
        },
      },
    });

    return fullForm;
  }

  static async deleteForm(userId: number, formId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { metadata: true },
    });

    const metadata = (user?.metadata as Record<string, unknown>) || {};
    const existingForms = (metadata.routingForms as RoutingFormDefinition[]) || [];
    const updatedForms = existingForms.filter((f) => f.id !== formId);

    await prisma.user.update({
      where: { id: userId },
      data: {
        metadata: {
          ...metadata,
          routingForms: updatedForms,
        },
      },
    });

    return true;
  }
}
