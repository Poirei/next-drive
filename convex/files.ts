import { ConvexError, v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { getUser } from "./users";

const hasAccessToOrg = async (
  ctx: QueryCtx | MutationCtx,
  orgId: string,
  tokenIdentifier: string
) => {
  const user = await getUser(ctx, tokenIdentifier);

  return user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId);
};

export const createFile = mutation({
  args: {
    name: v.string(),
    orgId: v.string(),
    fileId: v.id("_storage"),
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

    return ctx.db.insert("files", {
      name: args.name,
      orgId: args.orgId,
      fileId: args.fileId,
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

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError("You must be logged in to upload a file");
  }

  return ctx.storage.generateUploadUrl();
});
