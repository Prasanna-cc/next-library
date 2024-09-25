import { booksColumns } from "@/components/tableComponents/BooknMemberDataCols";
import { searchBooks } from "@/lib/actions";
import { SplitViews } from "@/app/[locale]/(home)/dashboard/SplitViews";
import CustomDialog from "@/components/CustomDialog";
import BookForm from "@/components/librarySpecificComponents/adminComponents/BookForm";
import { Plus } from "lucide-react";
import Search from "@/components/Search";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import ToolBar from "@/app/[locale]/(home)/ToolBar";
import { BookSplitViews } from "./BookSplitViews";

export default async function BookManagementPage({
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
  const ITEMS_PER_PAGE = 9;
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const query = searchParams?.query || "";
  const { items: books, pagination } = (await searchBooks({
    offset: (page - 1) * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE,
    search: query,
  }))!;
  const totalPages = Math.ceil(pagination.total / ITEMS_PER_PAGE);
  const t = await getTranslations("BooksPage");

  return (
    <div className="w-full px-4 py-8 flex flex-col justify-between gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <span className="text-slate-500 text-sm">{t("description")}</span>
      </div>
      <div className="flex flex-col gap-3 justify-between">
        <ToolBar
          firstHalf={<Search placeholder={t("searchPlaceholder")} />}
          secondHalf={
            <CustomDialog
              triggerText={
                <span className="flex gap-1 justify-center items-center">
                  <Plus className="w-4 h-4" />
                  {t("addButton")}
                </span>
              }
              triggerButtonClass="rounded-full"
            >
              <BookForm />
            </CustomDialog>
          }
        />
        {/* <Search placeholder="Search books..." /> */}
        {/* <CustomDialog
          triggerText={
            <span className="flex gap-1 justify-center items-center">
              <Plus className="w-4 h-4" />
              Add new book
            </span>
          }
          triggerButtonClass="rounded-full"
        >
          <BookForm />
        </CustomDialog> */}

        <BookSplitViews
          currentPage={page}
          totalPages={totalPages}
          data={books}
        />
      </div>
    </div>
  );
}
