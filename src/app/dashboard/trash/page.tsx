import { Files } from "@/components/files";
import { api } from "@/convex/_generated/api";
import { auth } from "@clerk/nextjs/server";
import { preloadQuery } from "convex/nextjs";

export default async function Page() {
  const { orgId: organizationId, userId, getToken } = await auth();

  const preloadedFiles = await preloadQuery(
    api.files.getFiles,
    {
      orgId: organizationId ?? userId ?? "",
      onlyFetchToBeDeleted: true,
    },
    {
      token:
        (await getToken({
          template: "convex",
        })) || undefined,
    },
  );

  return (
    <Files headerTitle="Trash" preloadedFiles={preloadedFiles} deletedOnly />
  );
}
