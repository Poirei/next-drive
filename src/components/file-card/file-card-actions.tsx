"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EllipsisVerticalIcon,
  HardDriveDownloadIcon,
  HeartIcon,
  Trash2Icon,
} from "lucide-react";
import { FileActionsDialog } from "./file-actions-dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { Doc } from "../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

export const FileCardActions = ({
  file,
  className,
}: {
  file: Doc<"files">;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const toggleFavorite = useMutation(api.files.toggleFavorite);

  const handleOpenConfirmationDialog = () => setOpen(true);

  return (
    <>
      <FileActionsDialog open={open} setOpen={setOpen} file={file} />
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "rounded-full hover:bg-secondary/70 p-2 border border-gray-700",
            className
          )}
        >
          <EllipsisVerticalIcon size={18} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="focus:bg-green-700/50 hover:bg-green-700/50 focus:text-green-400 hover:text-green-400 text-green-500 transition-all duration-150 ease-linear cursor-pointer"
            asChild
          >
            <Button
              className="bg-transparent w-full focus-visible:ring-0 flex justify-start"
              variant={"ghost"}
            >
              <HardDriveDownloadIcon />
              Download
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="bg-fuchsia-700/40 focus:bg-fuchsia-700/50 hover:bg-fuchsia-700/50 focus:text-fuchsia-400 hover:text-fuchsia-400 text-fuchsia-500 transition-all duration-150 ease-linear cursor-pointer"
            asChild
          >
            <Button
              className="bg-transparent w-full focus-visible:ring-0 flex justify-start"
              variant={"ghost"}
              onClick={async () => {
                await toggleFavorite({
                  fileId: file._id,
                });
              }}
            >
              <HeartIcon />
              Favorite
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="focus:bg-destructive/50 hover:bg-destructive/50 focus:text-red-400 hover:text-red-400 text-rose-500 transition-all duration-200 ease-linear cursor-pointer"
            asChild
          >
            <Button
              variant={"ghost"}
              className="bg-transparent w-full focus-visible:ring-0 flex justify-start"
              onClick={handleOpenConfirmationDialog}
            >
              <Trash2Icon />
              Delete
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
