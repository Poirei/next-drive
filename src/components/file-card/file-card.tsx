"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { FileCardActions } from "./file-card-actions";
import { withGradient } from "@/components/withGradient";
import { fileTypeToIconMap } from "@/lib/constants";
import { FileWithUrl } from "@/convex/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ArrowUpFromDotIcon } from "lucide-react";
import { formatDistance } from "date-fns";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export const FileCard = ({ file }: { file: FileWithUrl }) => {
  const TitleIcon = withGradient(fileTypeToIconMap[file.type], "stroke-1 mt-1");
  const ImageIcon = withGradient(
    fileTypeToIconMap[file.type],
    "w-32 h-32 stroke-[.55]",
  );

  const uploaderProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });

  return (
    <Card className="relative h-full w-full border-red-900">
      <CardHeader className="flex h-12 flex-row items-center justify-between border-b border-gray-700 pt-4">
        <CardTitle className="flex items-end gap-x-2 text-sm font-medium">
          {TitleIcon}
          <span>{file.name}</span>
        </CardTitle>
        <FileCardActions
          ellipsisDirection="vertical"
          file={file}
          className="absolute right-2 top-0"
        />
      </CardHeader>
      <CardContent className="mx-auto my-0 flex h-[200px] w-[200px] items-center justify-center rounded-md">
        {file.type === "image" ? (
          <Image
            src={file.url ?? ""}
            alt={file.name}
            width={200}
            height={200}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+J9SDwAETgHk0DnFhAAAAABJRU5ErkJggg=="
            className="h-[200px] w-[200px] self-start object-cover"
          />
        ) : (
          ImageIcon
        )}
      </CardContent>
      <CardFooter className="flex items-center gap-x-2 border-t border-gray-700 py-2 pl-2 text-xs font-light text-gray-400">
        <div className="flex w-[50%] items-center justify-start gap-x-2">
          <Avatar about="profile picture" className="h-6 w-6">
            <AvatarImage
              src={uploaderProfile?.avatarUrl}
              className="object-cover"
            />
            <AvatarFallback>
              {uploaderProfile?.name?.trim().charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="truncate text-xs font-light text-slate-400">
            {uploaderProfile?.name}
          </span>
        </div>
        <Separator className="h-1 w-1 rounded bg-gray-500" />
        <div className="flex grow items-center justify-start gap-1 truncate">
          <span className="truncate text-xs font-light">
            {formatDistance(new Date(file._creationTime), new Date(), {
              addSuffix: true,
            })}
          </span>
          <ArrowUpFromDotIcon className="h-3 w-3 stroke-lime-500" />
        </div>
      </CardFooter>
    </Card>
  );
};
