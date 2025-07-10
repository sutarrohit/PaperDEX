"use client";

import { orderStatusType } from "@/app/trade/_components/orderHistory";
import { getColumns } from "./columns";
import { DataTable } from "./data-table";
import { useMemo } from "react";

const OrderTable = ({ orderStatus, history = false }: { orderStatus: orderStatusType; history: boolean }) => {
  const columns = useMemo(() => getColumns(orderStatus), [orderStatus]);
  return <DataTable columns={columns} orderStatus={orderStatus} history={history} />;
};

export default OrderTable;
