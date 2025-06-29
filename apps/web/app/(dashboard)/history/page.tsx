"use client";

import OrderHistory from "@/app/trade/_components/orderHistory";
import { SectionCards, sectionDataSchema } from "@/components/global/section-cards";
import React from "react";
import { Bot, Hammer } from "lucide-react";

const SectionData: sectionDataSchema[] = [
  {
    name: "Total Balance",
    id: "totalBalance",
    data: "50",
    icon: Bot,
  },
  {
    name: "Pending Tx",
    id: "pendingTx",
    data: "201",
    icon: Hammer,
  },
];

const page = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <SectionCards data={SectionData} className="md:grid-cols-2 xl:grid-cols-3" />

      <div className="flex flex-col gap-2 h-full">
        <span className="text-[18px] font-semibold">Transaction History</span>

        <div className=" @container/main bg-muted/50 h-full flex-1 rounded-xl">
          <OrderHistory history={true} />
        </div>
      </div>
    </div>
  );
};

export default page;
