import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation } from "convex/react";
import { Trash2Icon, TriangleAlertIcon } from "lucide-react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { useToast } from "@/hooks/use-toast";

export const FileActionsDialog = ({
  open,
  setOpen,
  file,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  file: Doc<"files">;
}) => {
  const deleteFile = useMutation(api.files.deleteFile);
  const { toast } = useToast();

  const handleDeleteFile = () => {
    deleteFile({
      fileId: file._id,
    });

    toast({
      description: (
        <p className="flex items-center text-red-200 gap-2 font-medium">
          <Trash2Icon />
          <span>Your file has been deleted</span>
        </p>
      ),
      variant: "destructive",
      duration: 2500,
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="border border-red-500/50">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-between">
            <span>Are you absolutely sure?</span>
            <TriangleAlertIcon stroke="yellow" />
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your file
            and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/60 hover:text-destructive-foreground/80 transition-all duration-200 ease-in-out"
            onClick={handleDeleteFile}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
