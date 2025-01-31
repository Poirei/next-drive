import { CloudUploadIcon } from "lucide-react";
import { SearchBar } from "../search-bar";
import { Button } from "../ui/button";
import Upload from "../upload";
import { Dispatch } from "react";
import { FileWithUrl } from "@/convex/types";

export const FileBrowserHeader: React.FC<{
  title: string;
  setFiles: Dispatch<React.SetStateAction<FileWithUrl[]>>;
}> = ({ title, setFiles }) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-4xl font-bold">{title}</h1>
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
  );
};
