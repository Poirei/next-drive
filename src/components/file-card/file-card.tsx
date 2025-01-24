import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { FileCardActions } from "./file-card-actions";

export const FileCard = ({ file }: { file: Doc<"files"> }) => {
  return (
    <Card className="border-red-900">
      <CardHeader className="flex flex-row items-center justify-between pt-1">
        <CardTitle>{file.name}</CardTitle>
        <FileCardActions file={file} />
        {/* <CardDescription>Card Description</CardDescription> */}
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <Button>Download</Button>
      </CardFooter>
    </Card>
  );
};
