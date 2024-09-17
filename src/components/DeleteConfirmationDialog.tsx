"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

type DeleteConfirmationDialogProps = {
  onlyIcon?: boolean;
  onConfirm: () => void;
};

const DeleteConfirmationDialog = ({
  onlyIcon = false,
  onConfirm,
}: DeleteConfirmationDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {onlyIcon ? (
          <Button variant="destructive" className="">
            <Trash2 className=" h-4 w-4" />
          </Button>
        ) : (
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the book
            record.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {/* <Button variant="outline">Cancel</Button> */}
          <Button variant="destructive" onClick={onConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
