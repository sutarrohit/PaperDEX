import MenuBar from "@/components/global/menu-bar";
import React from "react";
// import MarketOverview from "@/components/global/market-overview";

const marketMenu: { name: string; symbol: string }[] = [
  {
    name: "All Crypto",
    symbol: "",
  },
  {
    name: "Spot",
    symbol: "",
  },
  {
    name: "Future",
    symbol: "",
  },
];

console.log("marketMenu", marketMenu);

const Market = () => {
  const changeMenu = <T extends string>(market: T) => {
    console.log("menu", market);
  };

  return (
    <div className="w-full px-2 ">
      {/* <p className="text-[28px] font-semibold">Market Overview</p> */}

      <MenuBar menuList={marketMenu} onSetSection={changeMenu} />
    </div>
  );
};

export default Market;
