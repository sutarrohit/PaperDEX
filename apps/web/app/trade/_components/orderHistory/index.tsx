"use client";

import OrderTable from "@/components/global/orders-table";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useState } from "react";

export type orderStatusType = "PENDING" | "FILLED";
const OrderHistory = ({ history = false }: { history: boolean }) => {
  const [orderStatus, setOrderStatus] = useState<orderStatusType>("PENDING");

  return (
    <Card className="w-full rounded-md p-3 h-full">
      <CardContent className="p-0 flex flex-col h-full gap-[14px]">
        <div className="relative w-full flex flex-col">
          <div className="flex gap-4 transition-all duration-300">
            <span
              className={`font-semibold text-orange-500 text-[14px] cursor-pointer ${orderStatus === "PENDING" && "underline -underline-offset-[-10px]"} `}
              onClick={() => {
                setOrderStatus("PENDING");
              }}
            >
              Open Order
            </span>
            <span
              className={`font-semibold text-orange-500 text-[14px] cursor-pointer ${orderStatus === "FILLED" && "underline -underline-offset-[-10px]"} `}
              onClick={() => {
                setOrderStatus("FILLED");
              }}
            >
              Order History
            </span>
          </div>

          <Separator className="absolute my-2 top-[17px]" />
        </div>

        <div className="flex-1 h-full">
          <OrderTable orderStatus={orderStatus} history={history} />
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderHistory;
