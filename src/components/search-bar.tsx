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
import { FileType } from "@/convex/types";
import { useConvex } from "convex/react";
import { useOrganization } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { SearchIcon } from "lucide-react";

const formSchema = z.object({
  query: z.string().max(255, "Title is too long"),
});

export const SearchBar = ({
  setFiles,
}: {
  setFiles: Dispatch<SetStateAction<FileType[]>>;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });
  const convex = useConvex();

  const { organization } = useOrganization();

  let orgId = "";

  if (organization) {
    orgId = organization.id;
  }

  useEffect(() => {
    const { unsubscribe } = form.watch(async ({ query }) => {
      const searchedFiles = await convex.query(api.files.getSearchedFiles, {
        orgId: orgId,
        query: query as string,
      });

      setFiles(searchedFiles);
    });

    return () => unsubscribe();
  }, [form, convex, orgId, setFiles]);

  return (
    <div>
      <Form {...form}>
        <form className="flex items-center gap-x-1 ">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Search for a file..."
                    {...field}
                    className="rounded-full border bg-primary-foreground border-green-200 placeholder:text-green-300/85 placeholder:italic focus:placeholder-transparent"
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
              "bg-green-300/85 hover:bg-green-400/85 transition-all duration-200 ease-linear flex gap-x-3 rounded-full"
            }
          >
            <SearchIcon className="stroke-slate-900 rotate-90 stroke-[2.5]" />
          </Button>
        </form>
      </Form>
    </div>
  );
};
