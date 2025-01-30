import { ConvexError, v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { getUser } from "./users";
import { fileTypes } from "./schema";

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
    type: fileTypes,
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
      type: args.type,
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

    const files = await ctx.db
      .query("files")
      .withIndex("by_org_id", (query) => query.eq("orgId", args.orgId))
      .collect();

    return Promise.all(
      files.map(async (file) => ({
        ...file,
        url: file.type === "image" ? await ctx.storage.getUrl(file.fileId) : "",
      }))
    );
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError("You must be logged in to upload a file");
  }

  return ctx.storage.generateUploadUrl();
});

export const deleteFile = mutation({
  args: {
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("You must be logged in to delete a file");
    }

    const file = await ctx.db.get(args.fileId);

    if (!file) {
      throw new ConvexError("File doesn't exist");
    }

    const hasAccess = await hasAccessToOrg(
      ctx,
      file.orgId,
      identity.tokenIdentifier
    );

    if (!hasAccess) {
      throw new ConvexError("You are not authorized to delete this file");
    }

    await ctx.db.delete(args.fileId);
  },
});

export const getSearchedFiles = query({
  args: {
    orgId: v.string(),
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("You must be logged in to search for a file");
    }

    const hasAccess = await hasAccessToOrg(
      ctx,
      args.orgId,
      identity.tokenIdentifier
    );

    if (!hasAccess) {
      throw new ConvexError(
        "You don't have access to files in this organization"
      );
    }

    let files = [];

    if (args.query.length === 0) {
      files = await ctx.db.query("files").collect();
    } else {
      files = await ctx.db
        .query("files")
        .withSearchIndex("search_file_name", (q) =>
          q.search("name", args.query)
        )
        .collect();
    }

    return Promise.all(
      files.map(async (file) => ({
        ...file,
        url: file.type === "image" ? await ctx.storage.getUrl(file.fileId) : "",
      }))
    );
  },
});
