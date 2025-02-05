import { Id } from "./_generated/dataModel";

export type FileWithUrl = {
  _id: Id<"files">;
  _creationTime: number;
  name: string;
  type: "image" | "csv" | "pdf" | "txt" | "all";
  orgId: string;
  fileId: Id<"_storage">;
  shouldDelete: boolean;
  userId: Id<"users">;
  url: string | null;
  isFavorited: boolean;
};

export type ConvexFile = {
  _id: Id<"files">;
  _creationTime: number;
  name: string;
  type: "image" | "csv" | "pdf" | "txt" | "all";
  orgId: string;
  fileId: Id<"_storage">;
  shouldDelete: boolean;
  userId: Id<"users">;
};
