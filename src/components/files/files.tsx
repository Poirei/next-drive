"use client";

import { useEffect, useState } from "react";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FileCard } from "../file-card/file-card";
import Image from "next/image";
import clsx from "clsx";
import Upload from "../upload";
import { Button } from "../ui/button";
import { CloudUploadIcon } from "lucide-react";
import { SearchBar } from "../search-bar";
import { FileType } from "@/convex/types";

export function Files({
  preloadedFiles,
}: {
  preloadedFiles: Preloaded<typeof api.files.getFiles>;
}) {
  const initialFiles = usePreloadedQuery(preloadedFiles);
  const [files, setFiles] = useState<FileType[]>(initialFiles);

  useEffect(() => {
    setFiles(() => initialFiles);
  }, [initialFiles]);

  console.log("Initial files: ", initialFiles);
  console.log("Files: ", files);

  return (
    <>
      {initialFiles && initialFiles?.length > 0 && (
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Your Files</h1>
          <div className="flex gap-7">
            <SearchBar setFiles={setFiles} />
            <Upload
              triggerComponent={
                <Button
                  variant={"default"}
                  className="flex items-center rounded-full"
                >
                  <CloudUploadIcon />
                  <span>Upload File</span>
                </Button>
              }
            />
          </div>
        </div>
      )}
      <div
        className={clsx(
          `grid ${files && files.length ? "grid-cols-1 md:grid-cols-4" : "grid-cols-1 justify-items-center"} gap-14 px-2 md:px-0 mt-10  `
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
              src={"/empty-folder.png"}
              alt="Empty Folder"
              width={500}
              height={500}
              className="filter invert sm:w-[70px] md:w-[500px] object-cover aspect-square"
            />
            <p className="font-medium text-lg">
              It&apos;s empty in here. Go ahead and{" "}
              <Upload
                triggerComponent={
                  <span className="decoration-green-500 underline hover:no-underline hover:bg-green-400 hover:px-1 rounded-full hover:text-black cursor-pointer transition-[padding] duration-300 ease-in-out text-green-400">
                    upload something
                  </span>
                }
              />
              .
            </p>
          </div>
        )}
      </div>
    </>
  );
}
