/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  isLandingPage?: boolean;
}

import { useSuspenseQuery } from "@tanstack/react-query";
import { getMarketData } from "@/lib/api/market-api";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { getQueryClient } from "@/lib/getQueryClient";

export function DataTable<TData, TValue>({ columns, isLandingPage = false }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pageCount, setPageCount] = React.useState(0);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const router = useRouter();

  const queryClient = getQueryClient();

  const { data: marketData, isLoading } = useSuspenseQuery({
    queryKey: ["market-table", pagination.pageIndex, pagination.pageSize],
    queryFn: async () => getMarketData(pagination.pageIndex, pagination.pageSize),
  });

  React.useEffect(() => {
    const socket = new WebSocket(`${process.env.NEXT_PUBLIC_ORDER_SERVICE}/stream/price`);

    socket.onopen = () => {
      socket.send(JSON.stringify({ pageIndex: pagination.pageIndex + 1, pageSize: pagination.pageSize }));
    };

    socket.onmessage = (event) => {
      const updatedData = JSON.parse(event.data);
      if (!updatedData?.data) return;

      queryClient.setQueryData(["market-table", pagination.pageIndex, pagination.pageSize], { ...updatedData });
    };

    return () => socket.close();
  }, [pagination.pageIndex, pagination.pageSize, queryClient]);

  React.useEffect(() => {
    if (marketData) {
      if (marketData.totalPages) {
        setPageCount(marketData.totalPages);
      }
    }
  }, [marketData, pagination.pageSize]);

  const table = useReactTable({
    data: marketData?.data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    pageCount,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4 w-full justify-end gap-4">
        {!isLandingPage && (
          <>
            <Input
              placeholder="Search Names..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
              className="max-w-xs"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto cursor-pointer">
                  Columns <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>

      <div className="rounded-lg overflow-hidden border">
        <Table className="">
          <TableHeader>
            {table?.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className={`text-end py-2.5 ${!isLandingPage && "bg-[#141414]"} `}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table?.getRowModel().rows?.length ? (
              table?.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`cursor-pointer ${isLandingPage && "border-transparent cursor-default"} `}
                  onClick={() => {
                    if (!isLandingPage) {
                      const { symbol } = row.original as { symbol: string };
                      const filterSymbol = symbol.endsWith("USDT") ? `${symbol}_DAI` : `${symbol}_USDT`;
                      router.push(`/trade/${filterSymbol}?mode=spot`);
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-end pr-5 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!isLandingPage && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
