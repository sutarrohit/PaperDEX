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

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  orderStatus?: orderStatusType;
  history: boolean;
}

import { useSuspenseQuery } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/getQueryClient";
import { orderStatusType } from "@/app/trade/_components/orderHistory";
import { getOrderHistory } from "@/lib/api/trade-api";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function DataTable<TData, TValue>({
  columns,
  orderStatus = "PENDING",
  history = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pageCount, setPageCount] = React.useState(0);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const queryClient = getQueryClient();

  const {
    data: marketData,
    isLoading,
    // isError,
  } = useSuspenseQuery({
    queryKey: ["order-history", orderStatus, pagination.pageIndex, pagination.pageSize],
    queryFn: () => getOrderHistory(orderStatus, pagination.pageIndex, pagination.pageSize),
    refetchInterval: 20000,
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

  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [orderStatus]);

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
    return (
      <div className="w-full h-full border border-pink-500 flex justify-center items-center">
        <svg
          aria-hidden="true"
          role="status"
          className="inline mr-2 w-6 h-6 text-gray-200 animate-spin dark:text-gray-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          ></path>
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="#fe8a1d"
          ></path>
        </svg>
        Loading...
      </div>
    );
  }

  return (
    // Add flex, flex-col to the main container
    <div className="w-full h-full flex flex-col">
      {history && (
        <div className="flex items-center pb-2 w-full justify-end gap-4">
          <Input
            placeholder="Search Names..."
            value={(table.getColumn("symbol")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("symbol")?.setFilterValue(event.target.value)}
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
        </div>
      )}
      {/* Add flex-grow and remove h-full here */}
      <div className="rounded-lg overflow-hidden border min-h-[100px] flex-grow hide-scrollbar">
        <Table>
          <TableHeader>
            {table?.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className={`text-end py-1 bg-[#141414]} `}>
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
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className={`border-transparent`}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-end pr-5 py-2">
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
      {history && (
        <div className="flex items-center justify-end space-x-2 pt-2  ">
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
