"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { FileCard } from "../file-card/file-card";
import Image from "next/image";
import clsx from "clsx";
import Upload from "../upload";
import { Button } from "../ui/button";
import { CloudUploadIcon } from "lucide-react";

export function Files({
  preloadedFiles,
}: {
  preloadedFiles: Preloaded<typeof api.files.getFiles>;
}) {
  const files = usePreloadedQuery(preloadedFiles);

  return (
    <>
      {files && files.length > 0 && (
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Your Files</h1>
          <Upload
            triggerComponent={
              <Button variant={"default"} className="flex items-center">
                <CloudUploadIcon />
                <span>Upload File</span>
              </Button>
            }
          />
        </div>
      )}
      <div
        className={clsx(
          `grid ${files && files.length ? "grid-cols-1 md:grid-cols-4" : "grid-cols-1 justify-items-center"} gap-14 px-2 md:px-0 mt-10  `
        )}
      >
        {files.length ? (
          files.map((file) => <FileCard key={file._id} file={file} />)
        ) : (
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
                  <span className="decoration-green-500 underline hover:no-underline hover:bg-green-400 py-1 rounded-sm hover:text-black cursor-pointer transition-all duration-200 ease-in-out transform rotate-90 text-green-400">
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
