import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const fileTypes = v.union(
  v.literal("image"),
  v.literal("csv"),
  v.literal("pdf"),
  v.literal("txt"),
);

export const roles = v.union(v.literal("admin"), v.literal("member"));

export default defineSchema({
  files: defineTable({
    name: v.string(),
    type: fileTypes,
    orgId: v.string(),
    fileId: v.id("_storage"),
    shouldDelete: v.boolean(),
  })
    .index("by_org_id", ["orgId"])
    .index("by_should_delete", ["shouldDelete"])
    .index("by_org_id_and_should_delete", ["orgId", "shouldDelete"])
    .searchIndex("search_file_name", {
      searchField: "name",
    }),

  users: defineTable({
    tokenIdentifier: v.string(),
    orgIds: v.array(
      v.object({
        orgId: v.string(),
        role: roles,
      }),
    ),
  }).index("by_token_identifier", ["tokenIdentifier"]),

  favorites: defineTable({
    fileId: v.id("files"),
    userId: v.id("users"),
    orgId: v.string(),
  }).index("by_user_id_and_org_id_and_file_id", ["userId", "orgId", "fileId"]),
});
