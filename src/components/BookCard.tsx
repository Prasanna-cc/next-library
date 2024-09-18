"use client";

import { IBook } from "@/lib/models/book.model";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Book, User } from "lucide-react";
import BookDrawer from "./BookDrawer";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";

const BookCard = ({ book }: { book: IBook }) => {
  const t = useTranslations();
  return (
    <BookDrawer book={book}>
      <Card key={book.id} className="w-full max-w-[30rem] flex flex-col h-full">
        <CardHeader className="w-full rounded-t flex items-center justify-center bg-slate-200">
          <Book className="w-40 h-40" />
        </CardHeader>
        <CardContent>
          <div className="pt-1 flex flex-col gap-4">
            <CardTitle className="w-full text-xl font-semibold truncate">
              {book.title}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-slate-500" />
              <p className="text-sm text-slate-600 truncate">{book.author}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="truncate">{book.genre}</Badge>
              <Badge
                variant={
                  book.availableNumOfCopies > 0 ? "secondary" : "destructive"
                }
                className={
                  book.availableNumOfCopies > 0 ? "bg-green-500 text-white" : ""
                }
              >
                {book.availableNumOfCopies > 0 ? "Available" : "Not Available"}
              </Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {/* <Button
          className="w-full"
          onClick={handleBorrow}
          disabled={book.availableNumOfCopies === 0}
        >
          Borrow
        </Button> */}
          <Button className="w-full">₹ {book.price}</Button>
          {/* <BookDrawer book={book} /> */}
        </CardFooter>
      </Card>
    </BookDrawer>
  );
};

export default BookCard;
