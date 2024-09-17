import { booksColumns } from "@/components/tableComponents/BooknMemberDataCols";
import { searchBooks } from "@/lib/actions";
import { TableWithPreview } from "../TableWithPreview";
import CustomDialog from "@/components/CustomDialog";
import BookForm from "@/components/displayAndInput/BookForm";
import { Plus } from "lucide-react";
import Search from "@/components/Search";

export default async function BookManagementPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const ITEMS_PER_PAGE = 9;
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const query = searchParams?.query || "";
  const { items: books, pagination } = (await searchBooks({
    offset: (page - 1) * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE,
    search: query,
  }))!;
  const totalPages = Math.ceil(pagination.total / ITEMS_PER_PAGE);

  return (
    <div className="w-full px-4 py-8 flex flex-col justify-between gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Book Management</h1>
        <span className="text-slate-500 text-sm">
          Manage the library collection with ease. Search through all available
          books, edit or delete existing entries, and add new books to keep the
          collection up to date.
        </span>
      </div>
      <div className="flex justify-between">
        <Search placeholder="Search books..." />
        <CustomDialog
          triggerText={
            <span className="flex gap-1 justify-center items-center">
              <Plus className="w-4 h-4" />
              Add new book
            </span>
          }
          triggerButtonClass="rounded-full"
        >
          <BookForm />
        </CustomDialog>
      </div>
      {books.length !== 0 ? (
        <TableWithPreview
          currentPage={page}
          totalPages={totalPages}
          data={books}
          columns={booksColumns}
          defaultTableColumns={[
            "select",
            "title",
            "availableNumOfCopies",
            "actions",
          ]}
        />
      ) : (
        <div className="flex text-sm text-slate-400 flex-col items-center ">
          <p>No Books found</p>
        </div>
      )}
    </div>
  );
}
