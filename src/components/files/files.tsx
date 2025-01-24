"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { FileCard } from "../file-card/file-card";

export function Files({
  preloadedFiles,
}: {
  preloadedFiles: Preloaded<typeof api.files.getFiles>;
}) {
  const files = usePreloadedQuery(preloadedFiles);

  return (
    <div className="grid grid-cols-2 gap-4 px-2 md:px-0 mt-10 md:grid-cols-4">
      {files.length ? (
        files.map((file) => <FileCard key={file._id} file={file} />)
      ) : (
        <p>No Files</p>
      )}
    </div>
  );
}
