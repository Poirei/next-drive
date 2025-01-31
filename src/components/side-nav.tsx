"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { FilesIcon, StarIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export const SideNav = () => {
  const pathName = usePathname();

  return (
    <div className="w-40 border border-r-0 border-gray-700 h-full rounded-l-2xl overflow-hidden p-2 pr-0 pt-4 flex flex-col gap-y-2">
      <Link href={"/dashboard/files"}>
        <Button
          variant="link"
          className={cn(
            "flex items-center justify-start gap-x-2 hover:bg-gray-700/50 w-full rounded-sm py-5 px-6 border-transparent hover:border-r-teal-300 border-r-2 rounded-tl-2xl",
            {
              "bg-gray-700/50 border-r-teal-300":
                pathName?.startsWith("/dashboard/files"),
            }
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
            "flex items-center justify-start gap-x-2 hover:bg-gray-700/50 w-full rounded-sm py-5 px-6 border-transparent hover:border-r-teal-300 border-r-2",
            {
              "bg-gray-700/50 border-r-teal-300": pathName?.includes(
                "/dashboard/favorites"
              ),
            }
          )}
        >
          <StarIcon />
          <span className="font-medium">Favorites</span>
        </Button>
      </Link>
    </div>
  );
};
