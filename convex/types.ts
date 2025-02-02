import { Id } from "./_generated/dataModel";

export type FileWithUrl = {
  _id: Id<"files">;
  _creationTime: number;
  name: string;
  type: "image" | "csv" | "pdf" | "txt";
  orgId: string;
  fileId: Id<"_storage">;
  url: string | null;
  isFavorited: boolean;
};
