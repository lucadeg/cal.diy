import { prisma } from "@calcom/prisma";
import { MembershipRole } from "@calcom/prisma/enums";

export type InputJsonValue = string | number | boolean | { [Key in string]?: InputJsonValue } | Array<InputJsonValue> | null | Record<string, any> | any;

export interface CreateTeamInput {
  name: string;
  slug: string;
  bio?: string;
  logoUrl?: string;
  hideBookATeamMember?: boolean;
  isPrivate?: boolean;
  parentId?: number;
  metadata?: InputJsonValue;
  creatorUserId: number;
}

export interface UpdateTeamInput {
  id: number;
  name?: string;
  slug?: string;
  bio?: string;
  logoUrl?: string;
  hideBookATeamMember?: boolean;
  isPrivate?: boolean;
  metadata?: InputJsonValue;
}

export class TeamRepository {
  static async findById(id: number) {
    return prisma.team.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                username: true,
                avatarUrl: true,
                timeZone: true,
              },
            },
          },
        },
        eventTypes: {
          select: {
            id: true,
            title: true,
            slug: true,
            length: true,
            schedulingType: true,
            hidden: true,
          },
        },
      },
    });
  }

  static async findBySlug(slug: string) {
    return prisma.team.findFirst({
      where: { slug },
      include: {
        members: {
          where: { accepted: true },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                username: true,
                avatarUrl: true,
                timeZone: true,
              },
            },
          },
        },
        eventTypes: {
          where: { hidden: false },
          select: {
            id: true,
            title: true,
            slug: true,
            length: true,
            description: true,
            schedulingType: true,
          },
        },
      },
    });
  }

  static async listUserTeams(userId: number) {
    return prisma.team.findMany({
      where: {
        members: {
          some: {
            userId,
            accepted: true,
          },
        },
      },
      include: {
        members: {
          where: { userId },
          select: { role: true, accepted: true },
        },
        _count: {
          select: {
            members: { where: { accepted: true } },
            eventTypes: true,
          },
        },
      },
    });
  }

  static async createTeam(input: CreateTeamInput) {
    return prisma.$transaction(async (tx: any) => {
      const team = await tx.team.create({
        data: {
          name: input.name,
          slug: input.slug,
          bio: input.bio,
          logoUrl: input.logoUrl,
          hideBookATeamMember: input.hideBookATeamMember ?? false,
          isPrivate: input.isPrivate ?? false,
          parentId: input.parentId,
          metadata: input.metadata,
        },
      });

      // Automatically add creator as OWNER
      await tx.membership.create({
        data: {
          teamId: team.id,
          userId: input.creatorUserId,
          role: MembershipRole.OWNER,
          accepted: true,
        },
      });

      return team;
    });
  }

  static async updateTeam(input: UpdateTeamInput) {
    const { id, ...data } = input;
    return prisma.team.update({
      where: { id },
      data,
    });
  }

  static async deleteTeam(id: number) {
    return prisma.team.delete({
      where: { id },
    });
  }

  static async addMember(teamId: number, userId: number, role: MembershipRole = MembershipRole.MEMBER) {
    return prisma.membership.upsert({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
      update: {
        role,
        accepted: true,
      },
      create: {
        teamId,
        userId,
        role,
        accepted: true,
      },
    });
  }

  static async updateMemberRole(teamId: number, userId: number, role: MembershipRole) {
    return prisma.membership.update({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
      data: {
        role,
      },
    });
  }

  static async removeMember(teamId: number, userId: number) {
    return prisma.membership.delete({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
    });
  }

  static async isSlugAvailable(slug: string, excludeTeamId?: number) {
    const existing = await prisma.team.findFirst({
      where: {
        slug: { equals: slug, mode: "insensitive" },
        ...(excludeTeamId ? { id: { not: excludeTeamId } } : {}),
      },
      select: { id: true },
    });
    return !existing;
  }
}
