"use client";

import OrderTable from "@/components/global/orders-table";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useState } from "react";

export type orderStatusType = "PENDING" | "FILLED";
const OrderHistory = () => {
  const [orderStatus, setOrderStatus] = useState<orderStatusType>("PENDING");

  return (
    <Card className="w-full rounded-md p-3 h-full">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="w-full flex gap-4">
          <span
            className="font-semibold text-[#FE8A1D] text-[14px] cursor-pointer"
            onClick={() => {
              setOrderStatus("PENDING");
            }}
          >
            Open Order
          </span>
          <span
            className="font-semibold text-[#FE8A1D] text-[14px] cursor-pointer"
            onClick={() => {
              setOrderStatus("FILLED");
            }}
          >
            Order History
          </span>
        </div>

        <Separator className="my-2" />

        <div className="flex-1 overflow-auto h-full">
          <OrderTable orderStatus={orderStatus} />
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderHistory;
