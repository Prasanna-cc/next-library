"use client";

import { useState, useCallback, useRef } from "react";
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
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import { createBook, updateBook } from "@/lib/actions";
import { toast } from "@/hooks/use-toast";
import { X, Upload } from "lucide-react";
import { onDeleteBook } from "../EditBookDialog";
import { IBookBase } from "@/lib/models/book.model";
import { Progress } from "../ui/progress";
import { useEdgeStore } from "@/lib/edgestore";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

type BookFormProps = {
  book?: IBook;
  handleBack?: () => void;
};

const BookForm = ({ book, handleBack }: BookFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(
    book?.imageUrl || null
  );
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isImageUploaded, setIsImageUploaded] = useState<boolean>(
    !!book?.imageUrl
  );
  const { edgestore } = useEdgeStore();
  const abortControllerRef = useRef<AbortController | null>(null);

  const previousImageUrl = book?.imageUrl;

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

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
      await uploadImage(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const uploadImage = async (fileToUpload: File) => {
    setIsUploading(true);
    setIsImageUploaded(false);
    abortControllerRef.current = new AbortController();

    try {
      const res = await edgestore.publicFiles.upload({
        file: fileToUpload,
        onProgressChange: (progress) => {
          setUploadProgress(progress);
        },
        options: {
          temporary: true,
        },

        signal: abortControllerRef.current.signal,
      });
      setImageUrl(res.url);
      setIsImageUploaded(true);
      return res.url;
    } catch (error) {
      if (error instanceof Error)
        if (error.name === "AbortError") {
        } else {
          console.error("Error uploading file:", error);
          toast({
            variant: "destructive",
            title: "Error uploading image",
            description: "Please try again.",
          });
        }
    } finally {
      setIsUploading(false);
      abortControllerRef.current = null;
    }
    return null;
  };

  const cancelUpload = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setFile(null);
    setImageUrl(null);
    setUploadProgress(0);
    setIsUploading(false);
    setIsImageUploaded(false);
  };

  const onSubmitCreate = async (data: IBook) => {
    try {
      const bookBaseData: IBookBase = {
        ...data,
        imageUrl,
      };
      const response = await createBook(bookBaseData);
      if (response) {
        if (imageUrl) {
          await edgestore.publicFiles.confirmUpload({
            url: imageUrl,
          });
        }
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
      if (!book) return;
      const response = await updateBook(book.id, { ...data, imageUrl });

      if (response) {
        if (previousImageUrl && imageUrl !== previousImageUrl) {
          if (imageUrl)
            await edgestore.publicFiles.confirmUpload({
              url: imageUrl,
            });
          await edgestore.publicFiles.delete({
            url: previousImageUrl,
          });
        }
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

  const isSubmitDisabled = isUploading || (!isImageUploaded && !book?.imageUrl);

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
                    valueAsNumber: field.type === "number",
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
          {/* Drag and Drop Image Upload */}
          <FormItem>
            <FormLabel>Book Cover Image</FormLabel>
            <FormControl>
              <div className="relative">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${
                    isDragActive ? "border-primary" : "border-gray-300"
                  }`}
                >
                  <input {...getInputProps()} />
                  {imageUrl ? (
                    <div className="flex flex-col items-center">
                      <Image
                        layout="fill"
                        src={imageUrl}
                        alt="Book cover"
                        className="max-h-40 mb-2"
                      />
                      <p>
                        Drag & drop to replace or click to select a new image
                      </p>
                    </div>
                  ) : isDragActive ? (
                    <p>Drop the image here ...</p>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-8 h-8 mb-2" />
                      <p>Drag & drop an image here, or click to select one</p>
                    </div>
                  )}
                </div>
                {(imageUrl || isUploading) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute h-6 w-6 top-0 right-0 hover:bg-red-500 hover:text-white"
                    onClick={cancelUpload}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </FormControl>
            {isUploading && (
              <Progress value={uploadProgress} className="mt-2" />
            )}
          </FormItem>
        </div>
        {book ? (
          <div className="pt-2 flex justify-end gap-2">
            <Button type="submit" disabled={isSubmitDisabled}>
              Save
            </Button>
            <DeleteConfirmationDialog onConfirm={() => onDeleteBook(book.id)} />
          </div>
        ) : (
          <Button
            type="submit"
            className="mt-2 w-full"
            disabled={isSubmitDisabled}
          >
            Add
          </Button>
        )}
      </form>
    </Form>
  );
};

export default BookForm;
