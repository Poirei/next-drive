import { Button } from "@/components/ui/button";
import { FilesIcon, StarIcon } from "lucide-react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="container mx-auto pt-20 h-full">
      <div className="flex h-full pb-5">
        <div className="w-40 border border-r-0 border-gray-700 h-full rounded-l-2xl overflow-hidden p-2 pr-0 pt-4">
          <Link href={"/dashboard/files"}>
            <Button
              variant="link"
              className="flex items-center justify-start gap-x-2 hover:bg-gray-700/50 w-full rounded-sm py-5 px-6 border-transparent hover:border-r-teal-300 border-r-2 rounded-tl-2xl"
            >
              <FilesIcon />
              <span className="font-medium">All Files</span>
            </Button>
          </Link>
          <Link href={"/dashboard/favorites"}>
            <Button
              variant="link"
              className="flex items-center justify-start gap-x-2 hover:bg-gray-700/50 w-full rounded-sm py-5 px-6 border-transparent hover:border-r-teal-300 border-r-2"
            >
              <StarIcon />
              <span className="font-medium">Favorites</span>
            </Button>
          </Link>
        </div>
        <div className="w-full border border-gray-700 rounded-r-md h-full p-4">
          {children}
        </div>
      </div>
    </main>
  );
}
