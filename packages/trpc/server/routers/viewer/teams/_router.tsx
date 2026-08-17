import authedProcedure from "../../../procedures/authedProcedure";
import publicProcedure from "../../../procedures/publicProcedure";
import { router } from "../../../trpc";
import { ZAddMemberInputSchema } from "./addMember.schema";
import { ZCreateTeamInputSchema } from "./create.schema";
import { ZDeleteTeamInputSchema } from "./delete.schema";
import { ZGetTeamInputSchema } from "./get.schema";
import { ZListTeamsInputSchema } from "./list.schema";
import { ZRemoveMemberInputSchema } from "./removeMember.schema";
import { ZUpdateTeamInputSchema } from "./update.schema";
import { ZRequestInstantMeetingSchema } from "./requestInstantMeeting.schema";
import { ZAcceptInstantMeetingSchema } from "./acceptInstantMeeting.schema";

export const teamsRouter = router({
  list: authedProcedure.input(ZListTeamsInputSchema).query(async ({ ctx }) => {
    const { listTeamsHandler } = await import("./list.handler");
    return listTeamsHandler({ ctx });
  }),

  get: authedProcedure.input(ZGetTeamInputSchema).query(async ({ input }) => {
    const { getTeamHandler } = await import("./get.handler");
    return getTeamHandler({ input });
  }),

  create: authedProcedure.input(ZCreateTeamInputSchema).mutation(async ({ input, ctx }) => {
    const { createTeamHandler } = await import("./create.handler");
    return createTeamHandler({ ctx, input });
  }),

  update: authedProcedure.input(ZUpdateTeamInputSchema).mutation(async ({ input }) => {
    const { updateTeamHandler } = await import("./update.handler");
    return updateTeamHandler({ input });
  }),

  delete: authedProcedure.input(ZDeleteTeamInputSchema).mutation(async ({ input }) => {
    const { deleteTeamHandler } = await import("./delete.handler");
    return deleteTeamHandler({ input });
  }),

  addMember: authedProcedure.input(ZAddMemberInputSchema).mutation(async ({ input }) => {
    const { addMemberHandler } = await import("./addMember.handler");
    return addMemberHandler({ input });
  }),

  removeMember: authedProcedure.input(ZRemoveMemberInputSchema).mutation(async ({ input }) => {
    const { removeMemberHandler } = await import("./removeMember.handler");
    return removeMemberHandler({ input });
  }),

  requestInstantMeeting: publicProcedure.input(ZRequestInstantMeetingSchema).mutation(async ({ input }) => {
    const { requestInstantMeetingHandler } = await import("./requestInstantMeeting.handler");
    return requestInstantMeetingHandler({ input });
  }),

  acceptInstantMeeting: authedProcedure.input(ZAcceptInstantMeetingSchema).mutation(async ({ input, ctx }) => {
    const { acceptInstantMeetingHandler } = await import("./acceptInstantMeeting.handler");
    return acceptInstantMeetingHandler({ ctx, input });
  }),
});
