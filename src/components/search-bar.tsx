"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useConvex } from "convex/react";
import { useOrganization, useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { SearchIcon } from "lucide-react";
import { ConvexFile, FileWithUrl } from "@/convex/types";

const formSchema = z.object({
  query: z.string().max(255, "Title is too long"),
});

export const SearchBar = ({
  setFiles,
  favoritesOnly,
  deletedOnly,
  filter,
}: {
  setFiles: Dispatch<SetStateAction<FileWithUrl[]>>;
  favoritesOnly?: boolean;
  deletedOnly?: boolean;
  filter: ConvexFile["type"];
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });
  const convex = useConvex();
  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  const { isLoaded: isUserLoaded, user } = useUser();

  let orgId = "";

  if (isOrgLoaded && isUserLoaded) {
    orgId = organization?.id ?? user?.id ?? "";
  }

  console.log(orgId);

  useEffect(() => {
    const { unsubscribe } = form.watch(async ({ query }) => {
      const searchedFiles = await convex.query(api.files.getSearchedFiles, {
        orgId: orgId,
        query: query as string,
        favoritesOnly: favoritesOnly ?? false,
        deletedOnly: deletedOnly ?? false,
        type: filter,
      });

      console.log("Files: ", searchedFiles);

      setFiles(searchedFiles);
    });

    return () => unsubscribe();
  }, [form, convex, orgId, setFiles, favoritesOnly, deletedOnly, filter]);

  return (
    <div>
      <Form {...form}>
        <form className="flex items-center gap-x-1">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Search for a file..."
                    {...field}
                    className="rounded-full border border-green-200 bg-primary-foreground placeholder:italic placeholder:text-green-300/85 focus:placeholder-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant={"ghost"}
            className={
              "flex gap-x-3 rounded-full bg-green-300/85 transition-all duration-200 ease-linear hover:bg-green-400/85"
            }
          >
            <SearchIcon className="rotate-90 stroke-slate-900 stroke-[2.5]" />
          </Button>
        </form>
      </Form>
    </div>
  );
};
