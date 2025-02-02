"use client";

import { useEffect, useState } from "react";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FileCard } from "../file-card/file-card";
import Image from "next/image";
import clsx from "clsx";
import Upload from "../upload";
import { FileBrowserHeader } from "../file-browser/file-browser-header";
import { FileWithUrl } from "@/convex/types";
import { Separator } from "../ui/separator";

export function Files({
  headerTitle,
  preloadedFiles,
  favoritesOnly,
  deletedOnly,
}: {
  headerTitle: string;
  preloadedFiles: Preloaded<typeof api.files.getFiles>;
  favoritesOnly?: boolean;
  deletedOnly?: boolean;
}) {
  const initialFiles = usePreloadedQuery(preloadedFiles);
  const [files, setFiles] = useState<FileWithUrl[]>(initialFiles);

  useEffect(() => {
    setFiles(() => initialFiles);
  }, [initialFiles]);

  let src = "";
  let description: React.ReactNode = null;

  switch (true) {
    case favoritesOnly:
      src = "/favorites.png";
      description =
        "No favorites? Not even one? Come on, show some files some love! 💔";
      break;
    case deletedOnly:
      src = "/trash.png";
      description =
        "Wow, such empty! Your trash is cleaner than my browser history.";
      break;
    default:
      src = "/empty-folder.png";
      description = (
        <>
          Looks like this folder is as empty as my wallet after Black Friday!
          Time to{" "}
          <Upload
            triggerComponent={
              <span className="cursor-pointer rounded-full text-green-400 underline decoration-green-500 transition-[padding] duration-300 ease-in-out hover:bg-green-400 hover:px-1 hover:text-black hover:no-underline">
                upload something
              </span>
            }
          />
          .
        </>
      );
      break;
  }

  return (
    <>
      {initialFiles && initialFiles?.length > 0 && (
        <>
          <FileBrowserHeader
            setFiles={setFiles}
            title={headerTitle}
            favoritesOnly={favoritesOnly}
            deletedOnly={deletedOnly}
          />
          <Separator className="mt-4 bg-slate-800" />
        </>
      )}
      <div
        className={clsx(
          `grid ${files && files.length ? "grid-cols-1 md:grid-cols-4" : "grid-cols-1 justify-items-center"} mt-10 gap-14 px-2 md:px-0`,
        )}
      >
        {files?.length > 0 &&
          files.map((file) => <FileCard key={file._id} file={file} />)}
        {initialFiles?.length > 0 && files?.length === 0 && (
          <p>
            Couldn&apos;t find anything related to what you were looking for.
          </p>
        )}
        {initialFiles?.length === 0 && (
          <div className="flex flex-col items-center gap-4">
            <Image
              src={src}
              alt="No files"
              width={500}
              height={500}
              className="aspect-square object-cover invert filter sm:w-[70px] md:w-[500px]"
            />
            <p className="text-lg font-medium">{description}</p>
          </div>
        )}
      </div>
    </>
  );
}
