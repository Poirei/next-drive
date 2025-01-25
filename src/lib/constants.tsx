import { Doc } from "../../convex/_generated/dataModel";
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
  Doc<"files">["type"],
  ({
    className,
    style,
  }: {
    className?: string;
    style?: React.CSSProperties;
  }) => React.ReactNode
>;
