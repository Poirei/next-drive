import { CloudUploadIcon } from "lucide-react";
import { SearchBar } from "../search-bar";
import { Button } from "../ui/button";
import Upload from "../upload";
import { Dispatch } from "react";
import { ConvexFile, FileWithUrl } from "@/convex/types";

export const FileBrowserHeader: React.FC<{
  title: string;
  setFiles: Dispatch<React.SetStateAction<FileWithUrl[]>>;
  favoritesOnly?: boolean;
  deletedOnly?: boolean;
  filter: ConvexFile["type"];
}> = ({ title, setFiles, favoritesOnly, deletedOnly, filter }) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-4xl font-bold">{title}</h1>

      <div className="flex gap-7">
        <SearchBar
          filter={filter}
          setFiles={setFiles}
          favoritesOnly={favoritesOnly}
          deletedOnly={deletedOnly}
        />
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
