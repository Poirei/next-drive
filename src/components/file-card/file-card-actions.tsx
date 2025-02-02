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
  UndoDotIcon,
  UndoIcon,
} from "lucide-react";
import { FileActionsDialog } from "./file-actions-dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { FileWithUrl } from "@/convex/types";
import { Protect } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";

export const FileCardActions = ({
  file,
  className,
}: {
  file: FileWithUrl;
  className?: string;
}) => {
  const toggleFavorite = useMutation(api.files.toggleFavorite);
  const restoreFile = useMutation(api.files.restoreFile);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleOpenConfirmationDialog = () => setOpen(true);

  const handleRestoreFile = async () => {
    await restoreFile({
      fileId: file._id,
    });

    toast({
      description: (
        <p className="flex items-center gap-2 font-medium">
          <UndoDotIcon />
          <span>Your file has been restored.</span>
        </p>
      ),
      variant: "success",
      duration: 2500,
    });
  };

  return (
    <>
      <FileActionsDialog open={open} setOpen={setOpen} file={file} />
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "rounded-full border border-gray-700 p-2 hover:bg-secondary/70",
            className,
          )}
        >
          <EllipsisVerticalIcon size={18} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-transparent backdrop-blur-xl">
          <DropdownMenuItem
            className="cursor-pointer bg-lime-700/20 text-lime-500 transition-all duration-150 ease-linear hover:bg-lime-700/50 hover:text-lime-400 focus:bg-lime-700/50 focus:text-lime-400"
            asChild
          >
            <Button
              className="flex w-full justify-start focus-visible:ring-0"
              variant={"ghost"}
            >
              <HardDriveDownloadIcon />
              Download
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer bg-fuchsia-700/20 text-fuchsia-500 transition-all duration-150 ease-linear hover:bg-fuchsia-700/50 hover:text-fuchsia-400 focus:bg-fuchsia-700/50 focus:text-fuchsia-400"
            asChild
          >
            <Button
              className="flex w-full justify-start focus-visible:ring-0"
              variant={"ghost"}
              onClick={async () => {
                await toggleFavorite({
                  fileId: file._id,
                });
              }}
            >
              <HeartIcon fill={file.isFavorited ? "currentColor" : "none"} />
              {file.isFavorited ? "Unfavorite" : "Favorite"}
            </Button>
          </DropdownMenuItem>
          <Protect role="org:admin" fallback={<></>}>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={cn(
                "cursor-pointer bg-pink-700/20 text-pink-500 transition-all duration-200 ease-linear hover:bg-pink-700/50 hover:text-pink-400 focus:bg-pink-700/50 focus:text-pink-400",
                {
                  "bg-cyan-700/20 text-cyan-500 hover:bg-cyan-700/50 hover:text-cyan-400 focus:bg-cyan-700/50 focus:text-cyan-400":
                    file.shouldDelete,
                },
              )}
              asChild
            >
              <Button
                variant={"ghost"}
                className="flex w-full justify-start focus-visible:ring-0"
                onClick={
                  file.shouldDelete
                    ? handleRestoreFile
                    : handleOpenConfirmationDialog
                }
              >
                {file.shouldDelete ? (
                  <>
                    <UndoIcon />
                    <span>Restore</span>
                  </>
                ) : (
                  <>
                    <Trash2Icon />
                    <span>Delete</span>
                  </>
                )}
              </Button>
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
