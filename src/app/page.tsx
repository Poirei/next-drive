import { FilesWrapper } from "@/components/files/files-wrapper";
import Upload from "@/components/upload";

export default function Home() {
  return (
    <main className="container mx-auto pt-20">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Your Files</h1>
        <Upload />
      </div>
      <div>
        <FilesWrapper />
      </div>
    </main>
  );
}
