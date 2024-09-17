import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export const TableSkeleton = ({
  cols,
  rows,
}: {
  cols: number;
  rows?: number;
}) => {
  const skeletonRows = Array.from({ length: rows ?? 10 }); // 5 rows of skeletons
  const skeletonColumns = Array.from({ length: cols }); // 4 columns of skeletons

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {skeletonColumns.map((_, index) => (
            <TableHead key={index}>
              <Skeleton className="h-4 w-24" /> {/* Adjust width as needed */}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {skeletonRows.map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {skeletonColumns.map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton className="h-4 w-full" />{" "}
                {/* Full width for each cell */}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
