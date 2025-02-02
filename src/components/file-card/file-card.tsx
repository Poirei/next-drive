import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { FileCardActions } from "./file-card-actions";
import { withGradient } from "@/components/withGradient";
import { fileTypeToIconMap } from "@/lib/constants";
import { FileWithUrl } from "@/convex/types";

export const FileCard = ({ file }: { file: FileWithUrl }) => {
  const TitleIcon = withGradient(fileTypeToIconMap[file.type], "stroke-1 mt-1");
  const ImageIcon = withGradient(
    fileTypeToIconMap[file.type],
    "w-32 h-32 stroke-[.55]",
  );

  return (
    <Card className="relative border-red-900">
      <CardHeader className="flex h-12 flex-row items-center justify-between border-b border-gray-700 pt-4">
        <CardTitle className="flex items-end gap-x-2 text-sm font-medium">
          {TitleIcon}
          <span>{file.name}</span>
        </CardTitle>
        <FileCardActions file={file} className="absolute right-2 top-0" />
      </CardHeader>
      <CardContent className="mx-auto my-0 flex h-[200px] w-[200px] items-center justify-center rounded-md">
        {file.type === "image" ? (
          <Image
            src={file.url ?? ""}
            alt={file.name}
            width={200}
            height={200}
            className="h-[200px] w-[200px] self-start object-cover"
          />
        ) : (
          ImageIcon
        )}
      </CardContent>
      <CardFooter className="flex items-center text-xs font-light text-gray-300">
        Uploaded: Jan 26, 2025
      </CardFooter>
    </Card>
  );
};
