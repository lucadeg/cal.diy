import { TeamRepository, type CreateTeamInput, type UpdateTeamInput } from "../repositories/TeamRepository";
import { MembershipRole } from "@calcom/prisma/enums";

export class TeamService {
  static async getTeam(id: number) {
    return TeamRepository.findById(id);
  }

  static async getTeamBySlug(slug: string) {
    return TeamRepository.findBySlug(slug);
  }

  static async getUserTeams(userId: number) {
    return TeamRepository.listUserTeams(userId);
  }

  static async createTeam(input: CreateTeamInput) {
    return TeamRepository.createTeam(input);
  }

  static async updateTeam(input: UpdateTeamInput) {
    return TeamRepository.updateTeam(input);
  }

  static async deleteTeam(id: number) {
    return TeamRepository.deleteTeam(id);
  }

  static async addMember(teamId: number, userId: number, role: MembershipRole = MembershipRole.MEMBER) {
    return TeamRepository.addMember(teamId, userId, role);
  }

  static async removeMember(teamId: number, userId: number) {
    return TeamRepository.removeMember(teamId, userId);
  }
}
