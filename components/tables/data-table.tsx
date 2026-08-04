import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/tables/table";
import { LoadingSkeleton } from "@/components/feedback/loading-skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { Inbox } from "lucide-react";

export interface DataTableColumn<T> {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  getRowId: (row: T) => string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  emptyTitle = "Nenhum registro encontrado",
  emptyDescription = "Quando houver dados, eles aparecerão aqui.",
  getRowId,
}: DataTableProps<T>) {
  if (isLoading) {
    return <LoadingSkeleton rows={4} />;
  }

  if (!data.length) {
    return (
      <EmptyState
        icon={Inbox}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.id}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={getRowId(row)}>
              {columns.map((column) => (
                <TableCell key={column.id}>{column.cell(row)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
