import { searchBooks } from "@/lib/actions";
import BookCard from "@/components/BookCard";
import SearchAndPagination from "@/app/[locale]/(home)/SearchAndPagination";
import { unstable_setRequestLocale } from "next-intl/server";

const ITEMS_PER_PAGE = 9;

export default async function BooksPage({
  searchParams,
  params: { locale },
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const query = searchParams?.query || "";
  const { items: books, pagination } = (await searchBooks({
    offset: (page - 1) * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE,
    search: query,
  }))!;
  const totalPages = Math.ceil(pagination.total / ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book Shelf</h1>
      <SearchAndPagination
        placeholder="Search books..."
        page={page}
        totalPages={totalPages}
      />
      {/* <div className="w-full flex flex-col pb-0 gap-3 justify-between md:pb-3 md:flex-row">
        <div className="w-full flex justify-start">
          <SearchComponent  />
        </div>
        <hr className="md:hidden" />
        <div className="w-full justify-center flex md:justify-end">
          <PaginationComponent currentPage={page} totalPages={totalPages} />
        </div>
      </div>
      <hr className="hidden md:block" /> */}
      <div className="w-full grid py-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.length === 0 ? (
          <p>No books found.</p>
        ) : (
          books.map((book) => (
            <div key={book.id} className="flex justify-center">
              <BookCard book={book} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
