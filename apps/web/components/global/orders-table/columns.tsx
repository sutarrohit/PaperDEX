/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TradeOrder } from "@/utils/types";
import { Badge } from "@/components/ui/badge";

import CancelOrder from "./cancelOrder";

export const getColumns = (orderStatus: string): ColumnDef<TradeOrder>[] => [
  {
    accessorKey: "symbol",
    header: ({ column }) => {
      return <div className="text-start">Asset</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="capitalize flex items-center gap-2 w-[180px] lg:w-full">
          {/* <Image
          src={row.original.symbol}
          alt={row.getValue("name")}
          width={50}
          height={50}
          className="w-[28px] h-[28px] rounded-full"
        /> */}

          <span className="pl-1">{row.original?.symbol}</span>
          {/* <span className="text-[10px] text-muted-foreground">{row.getValue("symbol")}</span> */}
        </div>
      );
    },
  },

  {
    accessorKey: "side",
    header: ({ column }) => {
      return <Button variant="ghost">Side</Button>;
    },
    cell: ({ row }) => (
      <div className="w-full flex justify-end">
        <div className="w-full lg:w-[128px] overflow-x-auto">
          <Badge variant="secondary" className={row.original.side === "BUY" ? "bg-green-500/40" : "bg-red-500/40"}>
            {row.getValue("side")}
          </Badge>
        </div>
      </div>
    ),
  },

  {
    accessorKey: "type",
    header: ({ column }) => {
      return <Button variant="ghost">Type</Button>;
    },
    cell: ({ row }) => (
      <div className="w-full flex justify-end">
        <div className="w-full lg:w-[128px] overflow-x-auto">
          <Badge variant={row.original.type === "LIMIT" ? "secondary" : "outline"}>{row.getValue("type")}</Badge>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Price
          <ArrowUpDown />
        </Button>
      );
    },

    cell: ({ row }) => (
      <div className="w-full flex justify-end">
        <div className="w-full lg:w-[128px] overflow-x-auto">
          {Number(row.getValue("price")).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </div>
      </div>
    ),
  },

  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Quantity
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="w-full flex justify-end">
        <div className="w-full lg:w-[128px] overflow-x-auto">{row.getValue("quantity")}</div>
      </div>
    ),
  },

  {
    accessorKey: "status",
    header: ({ column }) => {
      return <Button variant="ghost">Status</Button>;
    },
    cell: ({ row }) => (
      <div className="w-full flex justify-end">
        <div className="w-full lg:w-[128px] overflow-x-auto">
          <Badge
            variant="outline"
            className={row.original.status === "PENDING" ? "bg-orange-500/50" : "bg-blue-500/50"}
          >
            {row.getValue("status")}
          </Badge>
        </div>
      </div>
    ),
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return <Button variant="ghost">{orderStatus === "FILLED" ? "Placed At" : "Edit Order"}</Button>;
    },
    cell: ({ row }) => {
      const rawDate = row.getValue("createdAt");
      const formattedDate = new Date(rawDate as string | number | Date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      return row.original.status === "FILLED" ? (
        <div className="w-full flex justify-end">
          <div className="w-full overflow-x-auto">{formattedDate}</div>
        </div>
      ) : (
        <CancelOrder orderId={row.original.id} />
      );
    },
  },
];
