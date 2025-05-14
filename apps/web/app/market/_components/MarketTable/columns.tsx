/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import type { tokenMarket } from ".";
import numeral from "numeral";
import { customFormat } from "@/utils/adjustDecimal";

export const columns: ColumnDef<tokenMarket>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="text-start">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize flex items-center gap-2 w-[180px] lg:w-full ">
        <Image
          src={row.original.icon}
          alt={row.getValue("name")}
          width={50}
          height={50}
          className="w-[28px] h-[28px] rounded-full"
        />
        <span className="pl-1">{row.original?.symbol}</span>
        <span className="text-[12px] text-muted-foreground">{row.getValue("name")}</span>
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
    cell: ({ row }) => <div>{row.getValue("price")}</div>,
  },

  {
    accessorKey: "change_1hr",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          1h %
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className={Number(row.original.change_1hr) < 0 ? "text-[#f6465d]" : " text-[#0ecb81]"}>
        {customFormat(row.getValue("change_1hr"))} %
      </div>
    ),
  },

  {
    accessorKey: "change_1d",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          24h %
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className={Number(row.original.change_1d) < 0 ? "text-[#f6465d]" : " text-[#0ecb81]"}>
        {customFormat(row.getValue("change_1d"))} %
      </div>
    ),
  },

  {
    accessorKey: "change_1w",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          7d %
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className={Number(row.original.change_1w) < 0 ? "text-[#f6465d]" : " text-[#0ecb81]"}>
        {customFormat(row.getValue("change_1w"))} %
      </div>
    ),
  },

  {
    accessorKey: "volume_24hr",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          volume(24h)
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{numeral(row?.getValue("volume_24hr")).format("0.00a").toUpperCase()}</div>,
  },

  {
    accessorKey: "market_cap",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Market Cap
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{numeral(row?.getValue("market_cap")).format("0.00a").toUpperCase()}</div>,
  },
];
