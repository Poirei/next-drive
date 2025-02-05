"use client";

import { useEffect, useState, useTransition } from "react";
import { Preloaded, useConvex, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FileCard } from "../file-card/file-card";
import Image from "next/image";
import Upload from "../upload";
import { FileBrowserHeader } from "../file-browser/file-browser-header";
import { ConvexFile, FileWithUrl } from "@/convex/types";
import { Separator } from "../ui/separator";
import { DataTable } from "../file-browser/data-table";
import { columns } from "../file-browser/columns";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  LayoutGridIcon,
  ListFilterPlusIcon,
  Loader2,
  Rows3Icon,
} from "lucide-react";
import { useOrganization } from "@clerk/clerk-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";

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
  const [filter, setFilter] = useState<ConvexFile["type"]>(
    "all" as ConvexFile["type"],
  );
  const [isPending, startTransition] = useTransition();

  const convex = useConvex();
  const org = useOrganization();

  useEffect(() => {
    startTransition(() => setFiles(() => initialFiles));
  }, [initialFiles]);

  useEffect(() => {
    const watch = convex.watchQuery(api.files.getFiles, {
      orgId: org.organization?.id ?? "",
      type: filter,
    });

    const unsubscribe = watch.onUpdate(() =>
      setFiles(watch.localQueryResult() ?? []),
    );

    return () => unsubscribe();
  }, [filter, convex, org.organization?.id]);

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

  function handleFilterChange(value: ConvexFile["type"]) {
    setFilter(value);
  }

  return (
    <>
      {isPending ? (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin" />
          <p>Loading...</p>
        </div>
      ) : (
        <>
          {initialFiles && initialFiles?.length > 0 && (
            <>
              <FileBrowserHeader
                filter={filter}
                setFiles={setFiles}
                title={headerTitle}
                favoritesOnly={favoritesOnly}
                deletedOnly={deletedOnly}
              />
              <Separator className="mt-4 bg-slate-800" />
              <Tabs defaultValue="grid">
                <div className="flex items-center gap-10">
                  <TabsList>
                    <TabsTrigger
                      value="grid"
                      className="flex items-center gap-x-2"
                    >
                      <LayoutGridIcon className="h-4 w-4" />
                      <span>Grid</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="table"
                      className="flex items-center gap-x-2"
                    >
                      <Rows3Icon className="h-4 w-4" />
                      <span>Table</span>
                    </TabsTrigger>
                  </TabsList>
                  <div className="flex items-center gap-x-1 rounded-lg bg-muted p-1 pl-2">
                    <Label htmlFor="filter">
                      <ListFilterPlusIcon className="h-5 w-5" />
                    </Label>
                    <Select value={filter} onValueChange={handleFilterChange}>
                      <SelectTrigger
                        id="filter"
                        className="h-7 w-[150px] rounded-md bg-background"
                      >
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="txt">Text</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <TabsContent
                  value="grid"
                  className={cn(
                    "mt-10 grid grid-cols-1 justify-items-center gap-14 px-2 md:px-0",
                    {
                      "grid-cols-1 md:grid-cols-4": files && files.length,
                    },
                  )}
                >
                  {files?.length > 0 &&
                    files.map((file) => (
                      <FileCard key={file._id} file={file} />
                    ))}
                </TabsContent>
                <TabsContent value="table">
                  <DataTable columns={columns} data={files} />
                </TabsContent>
              </Tabs>
            </>
          )}
          <div
            className={cn(
              "mt-10 grid grid-cols-1 justify-items-center gap-14 px-2 md:px-0",
              {
                "grid-cols-1 md:grid-cols-4": files && files.length,
              },
            )}
          >
            {initialFiles?.length > 0 && files?.length === 0 && (
              <p>
                Couldn&apos;t find anything related to what you were looking
                for.
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
      )}
    </>
  );
}
