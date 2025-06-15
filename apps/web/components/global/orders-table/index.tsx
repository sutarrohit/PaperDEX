"use client";

import { orderStatusType } from "@/app/trade/_components/orderHistory";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const OrderTable = ({ orderStatus }: { orderStatus: orderStatusType }) => {
  return <DataTable columns={columns} orderStatus={orderStatus} />;
};

export default OrderTable;
