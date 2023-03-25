import { protectedVerifiedProcedure } from "$/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { createGroupInput } from "$/server/api/routers/groups/mutations/createAndUpdate/input";
import { getUserGroupsSelect } from "$/server/api/routers/groups/queries/getUserOwnedAndShared/handler";

const createHandler = protectedVerifiedProcedure
  .input(createGroupInput)
  .mutation(async ({ ctx, input }) => {
    const debtTableCount = await ctx.prisma.debtTable.count({
      where: {
        collaborators: {
          some: {
            collaboratorId: ctx.session.user.id,
            role: {
              equals: "OWNER",
            },
          },
        },
      },
    });

    if (debtTableCount >= 2) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No puedes tener más de 2 tablas",
      });
    }

    return ctx.prisma.debtTable.create({
      data: {
        name: input.name,
        description: input.description,
        collaborators: {
          create: {
            collaboratorId: ctx.session.user.id,
            role: "OWNER",
          },
        },
      },
      select: getUserGroupsSelect,
    });
  });

export default createHandler;