"use client";

import { orderStatusType } from "@/app/trade/_components/orderHistory";
import { getColumns } from "./columns";
import { DataTable } from "./data-table";
import { useMemo } from "react";

const OrderTable = ({ orderStatus }: { orderStatus: orderStatusType }) => {
  const columns = useMemo(() => getColumns(orderStatus), [orderStatus]);
  return <DataTable columns={columns} orderStatus={orderStatus} />;
};

export default OrderTable;
