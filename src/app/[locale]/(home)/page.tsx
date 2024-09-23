import { searchBooks } from "@/lib/actions";
import BookCard from "@/components/librarySpecificComponents/BookCard";
import ToolBar from "@/app/[locale]/(home)/ToolBar";
import { unstable_setRequestLocale } from "next-intl/server";
import { getLocale, getTranslations } from "next-intl/server";
import { useLocale } from "next-intl";
import SearchComponent from "@/components/Search";
import PaginationComponent from "@/components/Pagination";

const ITEMS_PER_PAGE = 8;

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
  const t = await getTranslations("BooksBrowsePage");

  return (
    <div className="container flex flex-col gap-8 mx-auto px-4 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <span className="text-slate-500 text-sm">{t("description")}</span>
      </div>
      <hr />
      <ToolBar
        firstHalf={<SearchComponent placeholder={t("searchPlaceholder")} />}
        secondHalf={
          <PaginationComponent currentPage={page} totalPages={totalPages} />
        }
        responsive
      />
      <div className="w-full grid pb-3 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
      <div className="flex justify-center items-center">
        <PaginationComponent currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
