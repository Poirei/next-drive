import { preloadQuery } from "convex/nextjs";
import { Files } from "./files";
import { auth } from "@clerk/nextjs/server";
import { api } from "../../../convex/_generated/api";

export async function FilesWrapper() {
  const { orgId: organizationId, userId, getToken } = await auth();

  const preloadedFiles = await preloadQuery(
    api.files.getFiles,
    {
      orgId: organizationId ?? userId ?? "",
    },
    {
      token:
        (await getToken({
          template: "convex",
        })) || undefined,
    }
  );

  return <Files preloadedFiles={preloadedFiles} />;
}
