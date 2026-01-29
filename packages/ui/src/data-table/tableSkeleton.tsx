import React from "react";
import {
  Skeleton,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@crunch-ui/core";

const TABLE_COL_LENGTH = 4;
const TABLE_ROW_LENGTH = 8;

export const TableSkeleton: React.FC = () => {
  return (
    <>
      <TableHeader>
        <TableRow>
          {Array.from({ length: TABLE_COL_LENGTH }, (_, index) => (
            <TableHead key={index}>
              <Skeleton className="w-36 h-6 my-2" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: TABLE_ROW_LENGTH }, (_, index) => (
          <TableRow key={index}>
            {Array.from({ length: TABLE_COL_LENGTH }, (_, index) => (
              <TableCell key={index}>
                <Skeleton className="w-32 h-6" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};
