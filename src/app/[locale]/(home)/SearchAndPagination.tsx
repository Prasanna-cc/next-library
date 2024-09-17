import PaginationComponent from "@/components/Pagination";
import SearchComponent from "@/components/Search";

export default function SearchAndPagination({
  placeholder,
  page,
  totalPages,
}: {
  placeholder: string;
  page: number;
  totalPages: number;
}) {
  return (
    <div>
      <div className="w-full flex flex-col pb-0 gap-3 justify-between md:pb-3 md:flex-row">
        <div className="w-full flex justify-start">
          <SearchComponent placeholder={placeholder} />
        </div>
        <hr className="md:hidden" />
        <div className="w-full justify-center flex md:justify-end">
          <PaginationComponent currentPage={page} totalPages={totalPages} />
        </div>
      </div>
      <hr className="hidden md:block" />
    </div>
  );
}
