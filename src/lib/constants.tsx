import { FileWithUrl } from "@/convex/types";
import { FileImageIcon, FileTextIcon, FileType2Icon } from "lucide-react";

export const fileTypeToIconMap = {
  pdf: ({ className, style }) => (
    <FileTextIcon className={className} style={style} />
  ),
  txt: ({ className, style }) => (
    <FileType2Icon className={className} style={style} />
  ),
  image: ({ className, style }) => (
    <FileImageIcon className={className} style={style} />
  ),
} as Record<
  FileWithUrl["type"],
  ({
    className,
    style,
  }: {
    className?: string;
    style?: React.CSSProperties;
  }) => React.ReactNode
>;
