import { ConvexError, v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { getUser } from "./users";
import { fileTypes } from "./schema";
import { Id } from "./_generated/dataModel";
import { FileWithUrl } from "./types";

const hasAccessToOrg = async (
  ctx: QueryCtx | MutationCtx,
  orgId: string,
  tokenIdentifier: string,
) => {
  const user = await getUser(ctx, tokenIdentifier);

  return (
    user.orgIds.some((org) => org.orgId === orgId) ||
    user.tokenIdentifier.includes(orgId)
  );
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
      identity.tokenIdentifier,
    );

    if (!hasAccess) {
      throw new ConvexError(
        "You are not authorized to upload a file to this organization",
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
    onlyFetchFavorites: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<FileWithUrl[]> => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    const hasAccess = await hasAccessToOrg(
      ctx,
      args.orgId,
      identity.tokenIdentifier,
    );

    if (!hasAccess) {
      throw new ConvexError("You are not authorized to view this organization");
    }

    let files: {
      _id: Id<"files">;
      _creationTime: number;
      name: string;
      type: "image" | "csv" | "pdf" | "txt";
      orgId: string;
      fileId: Id<"_storage">;
    }[] = [];

    const user = await getUser(ctx, identity.tokenIdentifier);

    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user_id_and_org_id_and_file_id", (query) =>
        query.eq("userId", user._id).eq("orgId", args.orgId),
      )
      .collect();

    if (args.onlyFetchFavorites) {
      if (!favorites.length) {
        return [];
      }

      files = (
        await Promise.all(
          favorites.map(async (favorite) => {
            const file = await ctx.db.get(favorite.fileId);
            return file;
          }),
        )
      ).filter((file): file is NonNullable<typeof file> => file !== null);
    } else {
      files = await ctx.db
        .query("files")
        .withIndex("by_org_id", (query) => query.eq("orgId", args.orgId))
        .collect();
    }

    return Promise.all(
      files.map(async (file) => ({
        ...file,
        url: await ctx.storage.getUrl(file.fileId),
        isFavorited: favorites.some((favorite) => favorite.fileId === file._id),
      })),
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
      identity.tokenIdentifier,
    );

    if (!hasAccess) {
      throw new ConvexError("You are not authorized to delete this file");
    }

    const user = await getUser(ctx, identity.tokenIdentifier);
    const isAdmin = user.orgIds.some(
      (org) => org.orgId === file.orgId && org.role === "admin",
    );

    if (!isAdmin) {
      throw new ConvexError("You are not authorized to delete this file");
    }

    await ctx.db.delete(args.fileId);
  },
});

export const getSearchedFiles = query({
  args: {
    orgId: v.string(),
    query: v.string(),
    favoritesOnly: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("You must be logged in to search for a file");
    }

    const hasAccess = await hasAccessToOrg(
      ctx,
      args.orgId,
      identity.tokenIdentifier,
    );

    if (!hasAccess) {
      throw new ConvexError(
        "You don't have access to files in this organization",
      );
    }

    let files: {
      _id: Id<"files">;
      _creationTime: number;
      name: string;
      type: "image" | "csv" | "pdf" | "txt";
      orgId: string;
      fileId: Id<"_storage">;
    }[] = [];

    const user = await getUser(ctx, identity.tokenIdentifier);

    const favFiles = await ctx.db
      .query("favorites")
      .withIndex("by_user_id_and_org_id_and_file_id", (q) =>
        q.eq("userId", user._id).eq("orgId", args.orgId),
      )
      .collect();

    if (args.query.length === 0) {
      if (!args.favoritesOnly) {
        files = await ctx.db
          .query("files")
          .withIndex("by_org_id", (q) => q.eq("orgId", args.orgId))
          .collect();
      } else {
        files = await Promise.all(
          favFiles.map(async (favorite) => {
            const file = await ctx.db.get(favorite.fileId);
            return file as NonNullable<typeof file>;
          }),
        );
      }
    } else {
      files = await ctx.db
        .query("files")
        .withSearchIndex("search_file_name", (q) =>
          q.search("name", args.query),
        )
        .collect();

      if (args.favoritesOnly) {
        const favoriteFileIds = new Set(favFiles.map((file) => file.fileId));

        files = files.filter((file) => favoriteFileIds.has(file._id));
      }
    }

    return Promise.all(
      files.map(async (file) => ({
        ...file,
        url: file.type === "image" ? await ctx.storage.getUrl(file.fileId) : "",
        isFavorited: favFiles.some((favorite) => favorite.fileId === file._id),
      })),
    );
  },
});

export const toggleFavorite = mutation({
  args: {
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("You must be log in first");
    }

    const file = await ctx.db.get(args.fileId);

    if (!file) {
      throw new ConvexError("File doesn't exist");
    }

    const hasAccess = await hasAccessToOrg(
      ctx,
      file.orgId,
      identity.tokenIdentifier,
    );

    if (!hasAccess) {
      throw new ConvexError(
        "You don't have access to files in this organization",
      );
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token_identifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) {
      throw new ConvexError("User doesn't exist");
    }

    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_id_and_org_id_and_file_id", (q) =>
        q
          .eq("userId", user._id)
          .eq("orgId", file.orgId)
          .eq("fileId", args.fileId),
      )
      .unique();

    if (!favorite) {
      await ctx.db.insert("favorites", {
        userId: user._id,
        orgId: file.orgId,
        fileId: file._id,
      });
    } else {
      await ctx.db.delete(favorite._id);
    }
  },
});
