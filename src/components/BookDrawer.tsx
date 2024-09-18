"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerFooter,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Book,
  User,
  Building,
  Hash,
  FileText,
  Layers,
  Edit,
} from "lucide-react";
// import { authController } from "@/lib/authController";
import { toast } from "@/hooks/use-toast";
import { IBook } from "@/lib/models/book.model";
import { cancelRequest, requestBook } from "@/lib/actions";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import EditBookDialog from "./EditBookDialog";
import { LoginDialog } from "./LoginForm";
import { AppError } from "@/lib/core/appError";

const BookDrawer = ({
  book,
  children,
}: {
  book: IBook;
  children?: React.ReactNode;
}) => {
  // const { session } = authController();
  const { data: session } = useSession();
  const [requestId, setRequestId] = useState<number | null>();
  const [showLogin, setShowLogin] = useState(false);

  const handleBorrow = async () => {
    if (!session) {
      toast({
        variant: "destructive",
        title: "You must log in",
        description: "Please log in to borrow this book.",
      });
      setShowLogin(!showLogin);
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
        if (error instanceof AppError)
          toast({
            variant: "destructive",
            title: "Request Failed",
            description:
              "This Book is currently not available. Please try again later.",
          });
        else
          toast({
            variant: "destructive",
            title: "Request Failed",
            description: "Something went wrong. Please try again later.",
          });
      }
    }
  };

  const handleCancel = async () => {
    if (!session) {
      toast({
        variant: "destructive",
        title: "You must log in",
        description: "Please log in to borrow this book.",
      });
    } else {
      try {
        if (requestId) {
          const isCancelled = await cancelRequest(requestId);
          if (isCancelled) {
            setRequestId(null);
            toast({
              variant: "default",
              title: "Request Cancelled",
              description:
                "Your request for this copy of book has been cancelled.",
            });
          } else
            toast({
              variant: "destructive",
              title: "Could not cancel",
              description:
                "Your request for this copy of book has been approved, so can't cancel it now.",
            });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Request Failed",
          description: "Something went wrong. Please try again later.",
        });
      }
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {/* <Button className="w-full">View</Button> */}
        {children ?? <Button className="w-full">View</Button>}
      </DrawerTrigger>
      <DrawerContent className="flex flex-col h-[60%] w-full  p-4">
        <div className="min-w-[340px] flex">
          <div className="w-1/3 flex justify-center items-start md:items-center">
            <Book className="w-24 h-24 text-slate-500" />
          </div>
          <div className="w-2/3 flex flex-col space-y-4">
            <div className=" w-full flex justify-between">
              <h2 className="text-xl font-semibold ">{book.title}</h2>
              {session?.user?.role === "admin" ? (
                <EditBookDialog book={book} />
              ) : (
                ""
              )}
            </div>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-slate-500" />
                  <p className="text-sm text-slate-600">{book.author}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-slate-500" />
                  <p className="text-sm text-slate-600">{book.publisher}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-slate-500" />
                  <p className="text-sm text-slate-600">{book.isbnNo}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <p className="text-sm text-slate-600">
                    {book.numOfPages} total pages
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {/* <Layers className="w-4 h-4 text-slate-500" /> */}
                  <Badge>{book.genre}</Badge>
                  <Badge
                    variant={
                      book.availableNumOfCopies > 0
                        ? "secondary"
                        : "destructive"
                    }
                    className={
                      book.availableNumOfCopies > 0
                        ? "bg-green-500 text-white"
                        : ""
                    }
                  >
                    {book.availableNumOfCopies > 0
                      ? "Available"
                      : "Not Available"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </div>
        </div>
        <DrawerFooter className="min-w-[300px] mt-auto flex flex-col items-center justify-center">
          <p className="text-center text-sm">
            Do you want to request borrow for this book?
          </p>
          <Button
            className={clsx("w-full md:w-[50%]", requestId && "hidden")}
            onClick={handleBorrow}
            disabled={book.availableNumOfCopies === 0}
          >
            ₹ {book.price}
          </Button>
          <div
            className={clsx(
              "w-full flex justify-between gap-2 md:w-[50%]",
              !requestId && "hidden"
            )}
          >
            <Button
              className="w-2/3"
              onClick={handleBorrow}
              disabled={book.availableNumOfCopies === 0}
            >
              Borrow another
            </Button>
            <Button
              variant={"destructive"}
              className="w-1/3"
              onClick={handleCancel}
              disabled={book.availableNumOfCopies === 0}
            >
              cancel
            </Button>
          </div>
          {showLogin ? <LoginDialog openOnLoad /> : ""}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default BookDrawer;
