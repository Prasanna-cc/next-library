"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerFooter,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Book,
  User,
  Building,
  Hash,
  FileText,
  Layers,
  Edit,
  Bookmark,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { IBook } from "@/lib/models/book.model";
import { cancelRequest, requestBook } from "@/lib/actions";
import { useSession } from "next-auth/react";
import EditBookDialog from "./adminComponents/EditBookDialog";
import { LoginDialog } from "../LoginForm";
import { AppError } from "@/lib/core/appError";
import Image from "next/image";
import clsx from "clsx";

const BookDrawer = ({
  book,
  children,
}: {
  book: IBook;
  children?: React.ReactNode;
}) => {
  const { data: session } = useSession();
  const [requestId, setRequestId] = useState<number | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  const handleBorrow = async () => {
    if (!session) {
      toast({
        variant: "destructive",
        title: "You must log in",
        description: "Please log in to borrow this book.",
      });
      setShowLogin(true);
    } else {
      try {
        const id = await requestBook({
          bookId: book.id,
          memberId: session.user.id,
        });
        if (id) {
          setRequestId(id);
          toast({
            title: "Request Successful",
            description: "Your request to borrow the book has been submitted.",
          });
        }
      } catch (error) {
        if (error instanceof AppError) {
          toast({
            variant: "destructive",
            title: "Request Failed",
            description: "This Book is currently not available.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Request Failed",
            description: "Something went wrong. Please try again later.",
          });
        }
      }
    }
  };

  const handleCancel = async () => {
    if (requestId) {
      const isCancelled = await cancelRequest(requestId);
      if (isCancelled) {
        setRequestId(null);
        toast({
          variant: "default",
          title: "Request Cancelled",
          description: "Your request for this book has been cancelled.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Could not cancel",
          description:
            "Your request has been approved, so it can't be cancelled.",
        });
      }
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children ?? <Button className="w-full">View</Button>}
      </DrawerTrigger>
      <DrawerContent className=" flex max-h-[75%] flex-col w-full p-4 gap-4">
        <div className="flex pb-20 md:pb-14 flex-col md:flex-row gap-4 overflow-y-auto no-scrollbar">
          {/* Image Section */}
          <div className="w-full md:w-1/3 flex flex-col justify-center items-center">
            {book.imageUrl ? (
              <Image
                src={book.imageUrl}
                alt="Book image"
                layout="responsive"
                width={1000}
                height={1000}
                className="max-w-60 max-h-[310px] md:max-w-72 md:max-h-96"
                placeholder="blur"
                blurDataURL={book.imageUrl}
              />
            ) : (
              <div className="flex items-center justify-center bg-slate-100 w-full h-full">
                <Book className="w-40 h-40" />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="w-full md:w-2/3 flex flex-col gap-4">
            <div className=" flex gap-2 items-start">
              <h2 className="text-2xl font-bold">{book.title}</h2>
              <Button variant="ghost" size="sm">
                <Bookmark className="w-4 h-4 " />
              </Button>
            </div>

            {/* Price Tag for larger screens */}
            {/* <div className="hidden md:block">
              <span className="text-xl font-bold">₹{book.price}</span>
            </div> */}
            <div className="flex h-full flex-col gap-2">
              <CardContent className="flex h-full flex-col gap-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-500" />
                  <p>{book.author}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-500" />
                  <p>{book.publisher}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-slate-500" />
                  <p>{book.isbnNo}</p>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <p>{book.numOfPages} total pages</p>
                </div>

                <div className="flex gap-2">
                  <Badge>{book.genre}</Badge>
                  {/* Availability Tags */}
                </div>
              </CardContent>
              <CardContent className="w-full h-full md:flex gap-2 hidden">
                <div className="flex flex-col">
                  <span className="text-xl flex gap-1 items-center">
                    <span className="text-green-500 font-extralight">
                      -15%{" "}
                    </span>
                    <span className="font-semibold">₹{book.price}</span>
                    {book.availableNumOfCopies === 0 && (
                      <Badge variant="destructive" className="text-xs">
                        Not Available
                      </Badge>
                    )}
                    {book.availableNumOfCopies > 0 &&
                      book.availableNumOfCopies < 3 && (
                        <Badge
                          variant="secondary"
                          className="bg-transparent text-red-500 text-xs"
                        >
                          Only few left!
                        </Badge>
                      )}
                  </span>
                  <span className="text-xs text-slate-500 line-through">
                    M.R.P.: ₹{Math.round(book.price + (15 / book.price) * 100)}
                  </span>
                </div>
              </CardContent>
            </div>

            {/* Price Tag for mobile view */}
          </div>
        </div>

        {/* Footer */}
        <div className="relative">
          <DrawerFooter className="absolute p-0  w-full bottom-0 bg-background/20 backdrop-blur backdrop-brightness-105">
            <div className="flex flex-col ">
              <div className="w-full md:hidden flex justify-end gap-2">
                <div className="flex flex-col items-end">
                  <span className="text-xl flex gap-1 items-center">
                    {book.availableNumOfCopies === 0 && (
                      <Badge variant="destructive" className="text-xs">
                        Not Available
                      </Badge>
                    )}
                    {book.availableNumOfCopies > 0 &&
                      book.availableNumOfCopies < 3 && (
                        <Badge
                          variant="secondary"
                          className="bg-transparent text-red-500 text-xs"
                        >
                          Only few left!
                        </Badge>
                      )}
                    <span className="text-green-500 font-extralight">
                      -15%{" "}
                    </span>
                    <span className="font-semibold">₹{book.price}</span>
                  </span>
                  <span className="text-xs text-slate-500 line-through">
                    M.R.P.: ₹{Math.round(book.price + (15 / book.price) * 100)}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-center text-sm pb-1">
                  Do you want to request borrow for this book?
                </p>
                <div className="flex justify-center gap-2">
                  <Button
                    className="w-full md:w-1/2 md:max-w-lg"
                    onClick={handleBorrow}
                    disabled={book.availableNumOfCopies === 0}
                  >
                    {!requestId ? "Borrow" : "Borrow Another"}
                  </Button>
                  {requestId && (
                    <Button
                      variant="destructive"
                      className="w-full md:w-1/2 md:max-w-72"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
            {showLogin && <LoginDialog openOnLoad />}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default BookDrawer;
