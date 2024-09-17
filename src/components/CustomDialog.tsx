import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CustomDialogProps {
  triggerText: string | React.ReactNode;
  title?: string;
  description?: string;
  children: React.ReactNode;
  triggerButtonClass?: string;
  triggerButtonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  triggerText,
  title,
  description,
  children,
  triggerButtonClass,
  triggerButtonVariant = "default",
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={triggerButtonVariant} className={triggerButtonClass}>
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-96 overflow-auto no-scrollbar max-w-[425px]">
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
