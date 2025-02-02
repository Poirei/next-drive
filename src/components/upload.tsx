"use client";

import { Button } from "@/components/ui/button";
import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";
import { useOrganization, useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  CircleXIcon,
  CloudUploadIcon,
  LoaderIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Doc } from "../../convex/_generated/dataModel";

const formSchema = z.object({
  title: z
    .string()
    .nonempty("Title cannot be empty")
    .max(255, "Title is too long"),
  file: z
    .custom<FileList>((val) => val instanceof FileList, {
      message: "Invalid file type",
    })
    .refine((files) => files.length > 0, "Atleast one file is required"),
});

export default function Upload(props: { triggerComponent: React.ReactNode }) {
  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  const { isLoaded: isUserLoaded, user } = useUser();
  const createFile = useMutation(api.files.createFile);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const fileRef = form.register("file");

  let orgId = "";

  if (isOrgLoaded && isUserLoaded) {
    orgId = organization?.id ?? user?.id ?? "";
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fileType = values.file[0].type;

    const allowedTypes = {
      "application/pdf": "pdf",
      "text/plain": "txt",
      "image/png": "image",
      "image/jpeg": "image",
    } as Record<string, Doc<"files">["type"]>;

    try {
      const uploadUrl = await generateUploadUrl();

      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": fileType || "text/plain",
        },
        body: values.file[0],
        signal: controller.signal,
      });

      const { storageId } = await result.json();

      await createFile({
        name: values.file[0].name,
        orgId,
        fileId: storageId,
        type: allowedTypes[fileType],
      });

      form.reset();
      setIsDialogOpen(false);
      toast({
        description: (
          <p className="flex items-center gap-2">
            <CheckCircle2Icon />
            <span>Your file has been uploaded.</span>
          </p>
        ),
        variant: "success",
        duration: 2500,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === "AbortError") {
        toast({
          description: (
            <p className="flex items-center gap-2 font-medium">
              <CircleXIcon />
              <span>Upload cancelled</span>
            </p>
          ),
          variant: "destructive",
          duration: 2500,
        });
      } else {
        toast({
          title: "Something went wrong",
          description: (
            <p className="flex items-center gap-2 font-medium">
              <AlertTriangleIcon />
              <span>An error has occurred: {error}</span>
            </p>
          ),
          variant: "destructive",
          duration: 2500,
        });
      }
    } finally {
      abortControllerRef.current = null;
    }
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        form.reset();
      }}
    >
      <DialogTrigger asChild>{props.triggerComponent}</DialogTrigger>
      <DialogContent className="bg-transparent backdrop-blur-3xl">
        <DialogHeader>
          <DialogTitle className="font-medium text-green-300/70">
            Upload a file
          </DialogTitle>
          <DialogDescription asChild>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col space-y-8 py-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="File title"
                          {...field}
                          className="rounded-full transition-all duration-200 ease-linear focus-visible:ring-slate-600"
                        />
                      </FormControl>
                      <FormMessage className="font-medium text-red-300" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="file"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-sm font-light italic text-muted-foreground">
                        Select a file
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          {...fileRef}
                          className="cursor-pointer rounded-full border-[2px] border-dashed transition-colors duration-200 ease-in-out hover:border-teal-700/60"
                        />
                      </FormControl>
                      <FormMessage className="font-medium text-red-300" />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    variant={"default"}
                    className={cn(
                      "flex gap-x-3 rounded-full bg-green-500 transition-all duration-200 ease-linear hover:bg-green-500/85",
                      {
                        "cursor-not-allowed bg-green-500/45 text-muted-foreground hover:bg-green-500/45":
                          form.formState.isSubmitting,
                      },
                    )}
                  >
                    {form.formState.isSubmitting ? (
                      <LoaderIcon className="h-4 w-4 animate-spin" />
                    ) : (
                      <CloudUploadIcon />
                    )}
                    <span>{`Upload${form.formState.isSubmitting ? "ing..." : ""}`}</span>
                  </Button>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant={"secondary"}
                      className="flex gap-x-3 rounded-full transition-all duration-200 ease-linear hover:bg-red-500/20 hover:text-red-400"
                      onClick={() => {
                        abortControllerRef.current?.abort();
                      }}
                    >
                      <CircleXIcon />
                      <span>Cancel</span>
                    </Button>
                  </DialogClose>
                </div>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
