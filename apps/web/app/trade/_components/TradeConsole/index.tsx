import React from "react";
import TradingViewWidget from "@/components/global/TradingChart";
import OrderBook from "../orderBook/page";
import TradingPanel from "@/components/global/trading-panel";
import OrderHistory from "../orderHistory";

const TradeConsole = ({ tokenPair, mode }: { tokenPair: string; mode: string }) => {
  const filterTokenPair = tokenPair.split("_").join("");

  return (
    <div className="w-full h-full">
      <div className="grid gap-2 grid-cols-1 lg:grid-cols-4 grid-rows-3 h-full">
        <div className="bg-[#161616] min-h-[250px] lg:col-span-2 lg:row-span-2 rounded-sm overflow-hidden p-1">
          <TradingViewWidget tokenPair={filterTokenPair} />
        </div>

        <div className="bg-[#161616] min-h-[250px] lg:row-span-2 rounded-sm">
          <OrderBook tokenPair={tokenPair} />
        </div>

        <div className="bg-[#161616] lg:col-span-3 h-full rounded-md">
          <OrderHistory />
        </div>

        <div className="bg-[#161616] lg:row-span-full lg:col-start-4 h-full rounded-md">
          <TradingPanel tokenPair={tokenPair} mode={mode} />
        </div>
      </div>
    </div>
  );
};

export default TradeConsole;
