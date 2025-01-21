import { ConvexError, v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { getUser } from "./users";

const hasAccessToOrg = async (
  ctx: QueryCtx | MutationCtx,
  orgId: string,
  tokenIdentifier: string
) => {
  const user = await getUser(ctx, tokenIdentifier);

  if (!user.orgIds.includes(orgId) || !user.tokenIdentifier.includes(orgId)) {
    return false;
  }

  return true;
};

export const createFile = mutation({
  args: {
    name: v.string(),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("You must be logged in to upload a file");
    }

    const hasAccess = await hasAccessToOrg(
      ctx,
      args.orgId,
      identity.tokenIdentifier
    );

    if (!hasAccess) {
      throw new ConvexError(
        "You are not authorized to upload a file to this organization"
      );
    }

    return await ctx.db.insert("files", {
      name: args.name,
      orgId: args.orgId,
    });
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    const hasAccess = await hasAccessToOrg(
      ctx,
      args.orgId,
      identity.tokenIdentifier
    );

    if (!hasAccess) {
      throw new ConvexError("You are not authorized to view this organization");
    }

    return await ctx.db
      .query("files")
      .withIndex("by_org_id", (query) => query.eq("orgId", args.orgId))
      .collect();
  },
});
