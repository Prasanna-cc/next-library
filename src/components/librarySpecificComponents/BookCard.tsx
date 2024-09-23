"use client";

import { IBook } from "@/lib/models/book.model";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Book, User, Bookmark } from "lucide-react";
import BookDrawer from "./BookDrawer";
import { Button } from "../ui/button";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Suspense, useState } from "react";
import PriceTag from "../PriceTag";
import PriceSkeleton from "../skeletons/PriceSkeleton";
import { LoginDialog } from "../LoginForm";
import CustomDialog from "../CustomDialog";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { requestBook } from "@/lib/actions";

const BookCard = ({ book }: { book: IBook }) => {
  const t = useTranslations("BooksBrowsePage");
  const [showLogin, setShowLogin] = useState(false);
  const [showBorrowDialog, setshowBorrowDialog] = useState(false);
  const { data: session } = useSession();

  const handleBorrowDialog = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session) {
      toast({
        variant: "destructive",
        title: "You must log in",
        description: "Please log in to borrow this book.",
      });
      setShowLogin(true);
    } else {
      setshowBorrowDialog(true);
    }
  };

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
          toast({
            title: "Request Successful",
            description: "Your request to borrow the book has been submitted.",
          });
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes("not available")) {
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

  return (
    <>
      <BookDrawer book={book}>
        <Card
          key={book.id}
          className="w-full max-w-[20rem] h-[400px] flex flex-col relative group overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 bg-transparent border-none"
        >
          <CardHeader className="w-full h-full p-0 relative overflow-hidden">
            {book.imageUrl ? (
              <div className="w-full h-full flex items-center justify-center">
                <Image
                  src={book.imageUrl}
                  placeholder="blur"
                  blurDataURL={book.imageUrl}
                  layout="fill"
                  objectFit="cover"
                  alt={"Book image"}
                  className="w-fit h-full transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100">
                <Book className="w-40 h-40" />
              </div>
            )}
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-0 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 hover:bg-black/70"
            >
              <Bookmark className="w-4 h-4 text-white" />
            </Button>
          </CardHeader>
          <CardContent className="absolute w-full bottom-0 p-0">
            <div className="px-2 pt-1 pb-2 w-full flex flex-col justify-between gap-1 bg-black bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 ">
              <div className="relative flex flex-col ">
                <h3 className="text-lg font-semibold truncate">{book.title}</h3>
                <p className="max-w-[70%] text-xs text-slate-600 truncate">
                  {book.author}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">
                  <Suspense fallback={<PriceSkeleton />}>
                    <PriceTag price={book.price} />
                  </Suspense>
                </span>
                {book.availableNumOfCopies === 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {t("notAvailable")}
                  </Badge>
                )}
                {book.availableNumOfCopies > 0 &&
                  book.availableNumOfCopies < 3 && (
                    <Badge
                      variant="secondary"
                      className=" bg-transparent text-xs text-red-500"
                    >
                      {t("onlyFewLeft")}
                    </Badge>
                  )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="absolute bottom-2 right-2 p-0">
            {book.availableNumOfCopies !== 0 ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleBorrowDialog}
                className="hover:text-white hover:bg-black"
              >
                {t("borrowButton")}
              </Button>
            ) : (
              ""
            )}
            {showLogin && <LoginDialog openOnLoad />}
          </CardFooter>
        </Card>
      </BookDrawer>
      {showBorrowDialog && (
        <CustomDialog
          openOnLoad
          onOpenChange={setshowBorrowDialog}
          title="Borrow Book"
          description="Do you want to borrow this Book?"
        >
          <div className="w-full flex justify-end">
            <Button onClick={handleBorrow} className="max-w-32">
              {t("borrowButton")}
            </Button>
          </div>
        </CustomDialog>
      )}
    </>
  );
};

export default BookCard;
