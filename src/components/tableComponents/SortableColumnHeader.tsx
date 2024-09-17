import { IBook } from "@/lib/models/book.model";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Column } from "@tanstack/react-table";

const SortButton = ({
  column,
  headerName,
}: {
  column: Column<Partial<IBook>, unknown>;
  headerName: string;
}) => {
  const sortStatus = column.getIsSorted();

  return (
    <Button
      variant={"ghost"}
      onClick={column.getToggleSortingHandler()}
      className="p-0"
    >
      {headerName}
      {sortStatus === "asc" ? (
        <ArrowDown className="ml-1 h-4 w-4" />
      ) : sortStatus === "desc" ? (
        <ArrowUp className="ml-1 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-1 h-4 w-4" />
      )}
    </Button>
  );
};

export const sortableColumnHeader = (headerName: string) => {
  const SortableHeader = ({
    column,
  }: {
    column: Column<Partial<IBook>, unknown>;
  }) => {
    return <SortButton column={column} headerName={headerName} />;
  };

  return SortableHeader;
};
