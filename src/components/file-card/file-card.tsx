import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import type { FileType } from "../../../convex/files";
import { FileCardActions } from "./file-card-actions";
import { withGradient } from "@/components/withGradient";
import { fileTypeToIconMap } from "@/lib/constants";

export const FileCard = ({ file }: { file: FileType }) => {
  const TitleIcon = withGradient(fileTypeToIconMap[file.type], "stroke-1 mt-1");
  const ImageIcon = withGradient(
    fileTypeToIconMap[file.type],
    "w-32 h-32 stroke-[.55]"
  );

  return (
    <Card className="border-red-900 relative">
      <CardHeader className="flex flex-row items-center justify-between pt-4 border-b border-gray-700 h-12">
        <CardTitle className="flex items-end gap-x-2 font-medium text-sm">
          {TitleIcon}
          <span>{file.name}</span>
        </CardTitle>
        <FileCardActions file={file} className="absolute top-0 right-2" />
      </CardHeader>
      <CardContent className="flex justify-center items-center rounded-md h-[200px] w-[200px] mx-auto my-0">
        {file.type === "image" ? (
          <Image
            src={file.url!}
            alt={file.name}
            width={200}
            height={200}
            className="object-cover w-[200px] h-[200px] self-start"
          />
        ) : (
          ImageIcon
        )}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};
