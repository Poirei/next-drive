"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { FilesIcon, StarIcon, Trash2Icon } from "lucide-react";
import { usePathname } from "next/navigation";

export const SideNav = () => {
  const pathName = usePathname();

  return (
    <div className="flex h-full w-40 flex-col gap-y-2 overflow-hidden rounded-l-2xl border border-r-0 border-gray-700 bg-background/50 p-2 pr-0 pt-4 backdrop-blur-lg">
      <Link href={"/dashboard/files"}>
        <Button
          variant="link"
          className={cn(
            "flex w-full items-center justify-start gap-x-2 rounded-sm rounded-tl-2xl border-r-2 border-transparent px-6 py-5 hover:border-r-teal-300 hover:bg-gray-700/50",
            {
              "border-r-teal-300 bg-gray-700/50":
                pathName?.startsWith("/dashboard/files"),
            },
          )}
        >
          <FilesIcon />
          <span className="font-medium">All Files</span>
        </Button>
      </Link>
      <Link href={"/dashboard/favorites"}>
        <Button
          variant="link"
          className={cn(
            "flex w-full items-center justify-start gap-x-2 rounded-sm border-r-2 border-transparent px-6 py-5 hover:border-r-teal-300 hover:bg-gray-700/50",
            {
              "border-r-teal-300 bg-gray-700/50": pathName?.includes(
                "/dashboard/favorites",
              ),
            },
          )}
        >
          <StarIcon />
          <span className="font-medium">Favorites</span>
        </Button>
      </Link>
      <Link href={"/dashboard/trash"}>
        <Button
          variant="link"
          className={cn(
            "flex w-full items-center justify-start gap-x-2 rounded-sm border-r-2 border-transparent px-6 py-5 hover:border-r-teal-300 hover:bg-gray-700/50",
            {
              "border-r-teal-300 bg-gray-700/50":
                pathName?.includes("/dashboard/trash"),
            },
          )}
        >
          <Trash2Icon />
          <span className="font-medium">Trash</span>
        </Button>
      </Link>
    </div>
  );
};
