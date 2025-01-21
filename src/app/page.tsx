"use client";

import { Button } from "@/components/ui/button";
import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useOrganization,
  useUser,
} from "@clerk/nextjs";

export default function Home() {
  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  const { isLoaded: isUserLoaded, user } = useUser();
  const createFile = useMutation(api.files.createFile);

  let orgId = "";

  if (isOrgLoaded && isUserLoaded) {
    orgId = organization?.id ?? user?.id ?? "";
  }

  const files = useQuery(
    api.files.getFiles,
    isOrgLoaded || isUserLoaded
      ? {
          orgId,
        }
      : "skip"
  );

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <SignedOut>
        <SignInButton mode="modal">
          <Button variant={"outline"}>Sign In</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <SignOutButton>
          <Button variant={"destructive"}>Sign Out</Button>
        </SignOutButton>
      </SignedIn>
      <Button
        variant={"default"}
        onClick={() => {
          createFile({ name: "test", orgId: organization?.id || "" });
        }}
      >
        Insert File
      </Button>
      <div>
        <p>Files:</p>
        {files?.map((file) => {
          return <p key={file._id}>{file.name}</p>;
        }) || <p>No files</p>}
      </div>
    </div>
  );
}
