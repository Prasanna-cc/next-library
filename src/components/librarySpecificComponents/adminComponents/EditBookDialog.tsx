"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookSchema, IBook } from "@/lib/models/book.schema";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import { deleteBook, updateBook } from "@/lib/actions";
import { toast } from "@/hooks/use-toast";
import { revalidatePath } from "next/cache";

export const onDeleteBook = async (id: number) => {
  try {
    const response = await deleteBook(id);
    if (response) {
      toast({
        variant: "default",
        title: "Book deleted successfully",
      });
      window.location.reload();
    }
  } catch (err) {
    toast({
      variant: "destructive",
      title: "Could not delete the book",
      description: "Please try again.",
    });
  }
};

type EditBookDialogProps = {
  book: IBook;
};

const EditBookDialog = ({ book }: EditBookDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<IBook>({
    resolver: zodResolver(BookSchema),
    defaultValues: book,
    mode: "onChange",
  });

  const formFields = [
    { label: "Title", name: "title", type: "text" },
    { label: "Author", name: "author", type: "text" },
    { label: "Publisher", name: "publisher", type: "text" },
    { label: "Genre", name: "genre", type: "text" },
    { label: "ISBN No.", name: "isbnNo", type: "text" },
    { label: "Number of Pages", name: "numOfPages", type: "number" },
    {
      label: "Total Number of Copies",
      name: "totalNumOfCopies",
      type: "number",
    },
  ];

  const onSubmit = async (data: IBook) => {
    try {
      const response = await updateBook(data.id, data);

      if (response) {
        toast({
          variant: "default",
          title: "Changes updated successfully",
        });
        setIsOpen(false);
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Could not update the changes",
        description: "Please try again.",
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            // onClick={() => setIsOpen(true)}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[472px] max-w-96 overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                {formFields.map((field) => (
                  <FormItem key={field.name}>
                    <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        type={field.type}
                        {...form.register(field.name as keyof IBook, {
                          valueAsNumber: field.type === "number", // for number fields
                        })}
                      />
                    </FormControl>
                    <div className="text-red-600 text-xs min-h-4">
                      <FormMessage className="text-xs">
                        {
                          form.formState.errors[field.name as keyof IBook]
                            ?.message
                        }
                      </FormMessage>
                    </div>
                  </FormItem>
                ))}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="submit">Save</Button>
                <DeleteConfirmationDialog
                  onConfirm={() => onDeleteBook(book.id)}
                />
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditBookDialog;
