import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { IMember } from "@/lib/models/member.model";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Book,
  User,
  Building,
  Hash,
  FileText,
  BookCopy,
  BookCheck,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ReceiptTextIcon,
  Tag,
} from "lucide-react";
import BookForm from "./BookForm";
import MemberForm from "./MemberForm";
import { IBook } from "@/lib/models/book.schema";
import PriceTag from "@/components/PriceTag";
import PriceSkeleton from "@/components/skeletons/PriceSkeleton";
import MemberEditForm from "./MemberEditForm";

type BookCardProps = {
  book: IBook;
};

export const BooksCard = ({ book: initialBook }: BookCardProps) => {
  useEffect(() => {
    setBook(initialBook);
  }, [initialBook]);
  const [book, setBook] = useState(initialBook);
  const [isEditing, setIsEditing] = useState(false);
  const content = [
    {
      label: "Author",
      icon: <User className="w-4 h-4" />,
      value: book.author,
    },
    {
      label: "Publisher",
      icon: <Building className="w-4 h-4" />,
      value: book.publisher,
    },
    {
      label: "Genre",
      icon: <Book className="w-4 h-4" />,
      value: book.genre,
    },
    {
      label: "ISBN",
      icon: <Hash className="w-4 h-4" />,
      value: book.isbnNo,
    },
    {
      label: "Pages",
      icon: <FileText className="w-4 h-4" />,
      value: book.numOfPages,
    },
    {
      label: "Total Copies",
      icon: <BookCopy className="w-4 h-4" />,
      value: book.totalNumOfCopies,
    },
    {
      label: "Available",
      icon: <BookCheck className="w-4 h-4" />,
      value: book.availableNumOfCopies,
    },
    {
      label: "Price",
      icon: <Tag className="w-4 h-4" />,
      value: (
        <Suspense fallback={<PriceSkeleton />}>
          <PriceTag price={book.price} />
        </Suspense>
      ),
    },
  ];

  const handleBookUpdate = (updatedBook?: IBook) => {
    if (updatedBook) setBook(updatedBook);
    setIsEditing(false);
  };

  return (
    <Card className="max-w-96 w-full min-w-72 max-h-full flex flex-col overflow-y-auto no-scrollbar">
      {isEditing ? (
        <div className="relative p-4 w-full h-full">
          <BookForm book={book} handleBack={handleBookUpdate} />
        </div>
      ) : (
        <>
          <div className="w-full flex flex-col justify-between items-center">
            <CardHeader className="w-full bg-slate-200 py-2">
              <div className="relative w-full flex justify-center">
                {book.imageUrl ? (
                  <Image
                    src={book.imageUrl}
                    alt="Book image"
                    layout="responsive"
                    width={100}
                    height={100}
                    className="max-w-40 max-h-48"
                    placeholder="blur"
                    blurDataURL={book.imageUrl}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <Book className="w-40 h-40" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4 w-full">
              <h3 className="text-lg font-semibold whitespace-nowrap overflow-x-scroll no-scrollbar">
                {book.title}
              </h3>
              <hr className="my-2" />
              <div className="w-full space-y-2 text-xs ">
                {content.map((item) => (
                  <div
                    key={item.label}
                    className="w-full flex items-center gap-2 overflow-x-scroll no-scrollbar"
                  >
                    <span>{item.icon}</span>
                    {/* <span className="font-medium">{item.label}:</span> */}
                    <span className="text-gray-600">{item.value}</span>
                    {item.label === "Available" ? (
                      Number(item.value) === 0 ? (
                        <Badge variant="destructive">No Stock</Badge>
                      ) : (
                        Number(item.value) <= 2 && (
                          <Badge className="bg-orange-400 hover:bg-orange-400">
                            Low Stock
                          </Badge>
                        )
                      )
                    ) : (
                      ""
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </div>
          <CardFooter className="pb-4 px-4 bg-gray-50">
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="w-full"
            >
              Edit
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

interface MemberCardProps {
  member: IMember;
}

export const MembersCard = ({ member }: MemberCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const content = [
    { label: "Email", icon: <Mail className="w-4 h-4" />, value: member.email },
    {
      label: "Phone",
      icon: <Phone className="w-4 h-4" />,
      value: member.phoneNumber,
    },
    {
      label: "Address",
      icon: <MapPin className="w-4 h-4" />,
      value: member.address,
    },
    { label: "Age", icon: <Calendar className="w-4 h-4" />, value: member.age },
  ];

  return (
    <Card className="w-full min-w-72 max-h-full max-w-sm flex flex-col overflow-y-auto no-scrollbar">
      {isEditing ? (
        <div className="relative w-full h-full p-4">
          <MemberEditForm
            member={member}
            handleBack={() => setIsEditing(false)}
          />
        </div>
      ) : (
        <>
          <div className="w-full flex flex-col justify-between items-center">
            <CardHeader className="w-full bg-slate-200">
              <div className="relative w-full flex justify-center">
                {/* <Image
                src={`https://picsum.photos/seed/${member.id}/400/300`}
                alt={member.name}
                layout="fill"
                objectFit="cover"
              /> */}
                <User className="w-32 h-32" />
              </div>
            </CardHeader>
            <CardContent className="pt-4 w-full">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <Badge
                  variant={member.role === "admin" ? "default" : "outline"} // 'default' for admin, 'outline' for user
                >
                  {member.role}
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                {content.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 overflow-x-scroll no-scrollbar"
                  >
                    <span>{item.icon}</span>
                    <span className="font-medium">{item.label}:</span>
                    <span className="text-gray-600">{item.value}</span>
                  </div>
                ))}
              </div>
              {member.status === "banned" && (
                <Badge variant="destructive" className="mt-2">
                  Banned
                </Badge>
              )}
            </CardContent>
          </div>
          <CardFooter className="p-4 bg-gray-50">
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="w-full"
            >
              Edit
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

type AllowedDataTypes = IBook | IMember;

interface CustomCardProps<T extends AllowedDataTypes> {
  data: T;
}

export const CustomCard = <T extends AllowedDataTypes>({
  data,
}: CustomCardProps<T>) => {
  return (
    <>
      {"isbnNo" in data ? (
        <BooksCard book={data} />
      ) : (
        <MembersCard member={data} />
      )}
    </>
  );
};
