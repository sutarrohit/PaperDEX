"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";
// import dynamic from "next/dynamic";

// const DataTable = dynamic(() => import("./data-table").then((mod) => mod.DataTable), {
//   ssr: false,
// }) as React.ComponentType<DataTableProps<tokenMarket, unknown>>;

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

type Props = { isLandingPage?: boolean };

const MarketTable = ({ isLandingPage }: Props) => {
  return <DataTable columns={columns} isLandingPage={isLandingPage} />;
};

export default MarketTable;
