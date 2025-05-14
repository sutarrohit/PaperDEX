import { columns } from "./columns";
import { DataTable } from "@/components/global/data-table/data-table";
import React from "react";

export type tokenMarket = {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  price: string;
  change_1hr: string;
  change_1d: string;
  change_1w: string;
  volume_24hr: string;
  market_cap: string;
};

const MarketTable = () => {
  return <DataTable columns={columns} />;
};

export default MarketTable;
