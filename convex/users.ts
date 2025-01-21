import { ConvexError, v } from "convex/values";
import { internalMutation, MutationCtx, QueryCtx } from "./_generated/server";

export const createUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      orgIds: [],
    });

    return user;
  },
});

export const addOrgIdToUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const user = await getUser(ctx, args.tokenIdentifier);

      await ctx.db.patch(user._id, {
        orgIds: [...user.orgIds, args.orgId],
      });
    } catch (error) {
      throw error;
    }
  },
});

export const getUser = async (
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string
) => {
  const user = await ctx.db
    .query("users")
    .withIndex("by_token_identifier", (q) =>
      q.eq("tokenIdentifier", tokenIdentifier)
    )
    .unique();

  if (!user) {
    throw new ConvexError("User not found");
  }

  return user;
};
