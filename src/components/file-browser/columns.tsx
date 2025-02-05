"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Id } from "@/convex/_generated/dataModel";
import { formatRelative } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FileCardActions } from "../file-card/file-card-actions";
import { FileWithUrl } from "@/convex/types";

function UserCell({ userId }: { userId: Id<"users"> }) {
  const uploaderProfile = useQuery(api.users.getUserProfile, {
    userId,
  });

  return (
    <div className="flex items-center justify-start gap-x-2">
      <Avatar about="profile picture" className="h-6 w-6">
        <AvatarImage
          src={uploaderProfile?.avatarUrl}
          className="object-cover"
        />
        <AvatarFallback>
          {uploaderProfile?.name?.trim().charAt(0)}
        </AvatarFallback>
      </Avatar>
      <span className="truncate">{uploaderProfile?.name}</span>
    </div>
  );
}

function FileActionsCell({
  fileId,
  orgId,
  userId,
}: {
  fileId: Id<"files">;
  orgId: string;
  userId: Id<"users">;
}) {
  const file = useQuery(api.files.getFileById, {
    fileId,
    orgId,
    userId,
  });

  if (!file) return null;

  return <FileCardActions file={file} ellipsisDirection="horizontal" />;
}

export const columns: ColumnDef<FileWithUrl>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "publisher",
    header: "Publisher",
    cell: ({ row }) => <UserCell userId={row.original.userId} />,
  },
  {
    accessorKey: "published",
    header: "Published",
    cell: ({ row }) => (
      <div>
        {formatRelative(new Date(row.original._creationTime), new Date())}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <FileActionsCell
        fileId={row.original._id}
        orgId={row.original.orgId}
        userId={row.original.userId}
      />
    ),
  },
];
