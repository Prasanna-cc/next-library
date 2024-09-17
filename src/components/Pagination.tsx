"use client";

import { useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowLeftFromLine,
  ArrowLeftIcon,
  ArrowLeftToLine,
  ArrowRight,
  ArrowRightToLine,
} from "lucide-react";
import { Button } from "./ui/button";
import clsx from "clsx";

interface PaginationComponentProps {
  totalPages: number;
  currentPage: number;
}

export default function PaginationComponent({
  totalPages,
  currentPage,
}: PaginationComponentProps) {
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  return (
    <div className="">
      <Pagination>
        <PaginationContent>
          <PaginationItem className="md:hidden">
            <Link href={createPageURL(1)}>
              <Button className="px-3" variant={"outline"}>
                <ArrowLeftToLine
                  className="w-4 h-4"
                  aria-disabled={currentPage === 1}
                />
              </Button>
            </Link>
          </PaginationItem>
          <PaginationItem>
            <Link href={createPageURL(Math.max(1, currentPage - 1))}>
              <Button className="px-3" variant={"outline"}>
                <ArrowLeft
                  className="w-4 h-4"
                  aria-disabled={currentPage === 1}
                />
              </Button>
            </Link>
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            const isNearCurrent =
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1);

            const isEllipsis =
              pageNumber === currentPage - 2 || pageNumber === currentPage + 2;

            if (isNearCurrent) {
              return (
                <PaginationItem
                  className={clsx(
                    "md:inline-flex",
                    pageNumber !== currentPage &&
                      // pageNumber !== currentPage - 1 &&
                      // pageNumber !== currentPage + 1 &&
                      "hidden "
                  )}
                  key={pageNumber}
                >
                  <Link href={createPageURL(pageNumber)}>
                    {pageNumber === currentPage ? (
                      <Button variant={"default"}>{pageNumber}</Button>
                    ) : (
                      <Button variant={"ghost"}>{pageNumber}</Button>
                    )}
                  </Link>
                </PaginationItem>
              );
            } else if (isEllipsis) {
              return (
                <PaginationEllipsis
                  className="hidden md:inline-flex"
                  key={pageNumber}
                />
              );
            }
            return null;
          })}
          <PaginationItem>
            <Link href={createPageURL(Math.min(totalPages, currentPage + 1))}>
              <Button className="px-3" variant={"outline"}>
                <ArrowRight
                  className="w-4 h-4"
                  aria-disabled={currentPage === totalPages}
                />
              </Button>
            </Link>
          </PaginationItem>
          <PaginationItem className="md:hidden">
            <Link href={createPageURL(totalPages)}>
              <Button className="px-3" variant={"outline"}>
                <ArrowRightToLine
                  className="w-4 h-4"
                  aria-disabled={currentPage === 1}
                />
              </Button>
            </Link>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
