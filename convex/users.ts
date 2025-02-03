import { ConvexError, v } from "convex/values";
import {
  internalMutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";
import { roles } from "./schema";

export const createUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      orgIds: [],
    });

    return user;
  },
});

export const updateUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx, args.tokenIdentifier);

    await ctx.db.patch(user._id, {
      name: args.name,
      avatarUrl: args.avatarUrl,
    });
  },
});

export const addOrgIdToUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    orgId: v.string(),
    role: roles,
  },
  handler: async (ctx, args) => {
    try {
      const user = await getUser(ctx, args.tokenIdentifier);

      const isAlradyAMember = user.orgIds.some(
        (org) => org.orgId === args.orgId,
      );

      if (isAlradyAMember) {
        throw new ConvexError("User is already a member of this organization");
      }

      await ctx.db.patch(user._id, {
        orgIds: [...user.orgIds, { orgId: args.orgId, role: args.role }],
      });
    } catch (error) {
      throw error;
    }
  },
});

export const updateRoleInOrgForUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    orgId: v.string(),
    role: roles,
  },
  handler: async (ctx, args) => {
    try {
      const user = await getUser(ctx, args.tokenIdentifier);
      const orgIndex = user.orgIds.findIndex((org) => org.orgId === args.orgId);

      if (orgIndex === -1) {
        throw new ConvexError(
          "No organization found associated with this user",
        );
      }

      const orgs = user.orgIds;
      orgs[orgIndex].role = args.role;

      await ctx.db.patch(user._id, {
        orgIds: orgs,
      });
    } catch (error) {
      throw error;
    }
  },
});

export const removeOrgIdFromUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    orgId: v.string(),
    role: roles,
  },
  handler: async (ctx, args) => {
    try {
      const user = await getUser(ctx, args.tokenIdentifier);
      const orgIndex = user.orgIds.findIndex(
        (org) => org.orgId === args.orgId && org.role === args.role,
      );

      if (orgIndex === -1) {
        throw new ConvexError(
          "No organization found associated with this user",
        );
      }

      const orgs = user.orgIds.filter(
        (org) => !(org.orgId === args.orgId && org.role === args.role),
      );

      await ctx.db.patch(user._id, {
        orgIds: orgs,
      });
    } catch (error) {
      throw error;
    }
  },
});

export const getUserProfile = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    return {
      name: user?.name,
      avatarUrl: user?.avatarUrl,
    };
  },
});

export const getUser = async (
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string,
) => {
  const user = await ctx.db
    .query("users")
    .withIndex("by_token_identifier", (q) =>
      q.eq("tokenIdentifier", tokenIdentifier),
    )
    .unique();

  if (!user) {
    throw new ConvexError("User not found");
  }

  return user;
};
