"use client";
import MenuBar from "@/components/global/menu-bar";
import { useState } from "react";
import MarketTable from "./_components/MarketTable";

const marketMenu: { label: string; symbol: string }[] = [
  {
    label: "All Crypto",
    symbol: "",
  },
  {
    label: "Spot Market",
    symbol: "",
  },
  {
    label: "Future Market",
    symbol: "",
  },
];

const Market = () => {
  const [currentLabel, setCurrentLabel] = useState<string>("All Crypto");

  const changeMenu = <T extends string>(market: T) => {
    setCurrentLabel(market);
  };

  return (
    <div className="w-full px-2 mt-10 flex flex-col gap-4">
      <div className="overflow-x-auto hide-scrollbar">
        <div className="w-fit">
          <MenuBar menuList={marketMenu} onSetSection={changeMenu} currentLabel={currentLabel} />
        </div>
      </div>
      <MarketTable />
    </div>
  );
};

export default Market;
