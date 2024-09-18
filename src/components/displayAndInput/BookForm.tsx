"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookSchema, BookSchemaBase, IBook } from "@/lib/models/book.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog"; // assume this is the delete confirmation dialog
import { createBook, deleteBook, updateBook } from "@/lib/actions";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, X } from "lucide-react";
import { onDeleteBook } from "../EditBookDialog";

type BookFormProps = {
  book?: IBook;
  handleBack?: () => void;
};

const BookForm = ({ book, handleBack }: BookFormProps) => {
  const form = useForm<IBook>({
    resolver: zodResolver(BookSchemaBase),
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
    { label: "Price", name: "price", type: "number" },
  ];

  const onSubmitCreate = async (data: IBook) => {
    try {
      const response = await createBook(data);
      if (response) {
        toast({
          variant: "default",
          title: "Book added successfully",
        });
        handleBack?.();
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Could not add the book",
        description: "Please try again.",
      });
    }
  };

  const onSubmitUpdate = async (data: IBook) => {
    try {
      const response = await updateBook(data.id, data);

      if (response) {
        toast({
          variant: "default",
          title: "Changes updated successfully",
        });
        handleBack?.();
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(book ? onSubmitUpdate : onSubmitCreate)}
        className="w-full h-full"
      >
        <div className="pb-2 flex justify-between items-center">
          <FormLabel className="text-lg font-bold">
            {book ? "Edit Book" : "Add Book"}
          </FormLabel>
          {book ? (
            <Button variant="ghost" onClick={handleBack}>
              <X className="w-4 h-4" />
            </Button>
          ) : (
            ""
          )}
        </div>
        <div className="w-full flex flex-col gap-1">
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
              <div className="text-red-600 min-h-4 overflow-x-auto no-scrollbar">
                <FormMessage className="text-xs">
                  {form.formState.errors[field.name as keyof IBook]?.message}
                </FormMessage>
              </div>
            </FormItem>
          ))}
        </div>
        {book ? (
          <div className="pt-2 flex justify-end gap-2">
            <Button type="submit">Save</Button>
            <DeleteConfirmationDialog onConfirm={() => onDeleteBook(book.id)} />
          </div>
        ) : (
          <Button type="submit" className="mt-2 w-full">
            add
          </Button>
        )}
      </form>
    </Form>
  );
};

export default BookForm;
