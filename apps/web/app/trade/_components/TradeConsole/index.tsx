import React from "react";
import TradingViewWidget from "@/components/global/TradingChart";

const TradeConsole = ({ tokenPair }: { tokenPair: string }) => {
  return (
    <div className="border w-full h-full">
      <div className="grid gap-2 grid-cols-1 lg:grid-cols-4 grid-rows-3 border  h-full">
        <div className="border bg-[#161616] border-[#6a6a6a] min-h-[250px] lg:col-span-2 lg:row-span-2">
          <TradingViewWidget tokenPair={tokenPair} />
        </div>

        <div className="border bg-[#161616] border-[#6a6a6a] min-h-[250px] lg:row-span-2"></div>

        <div className="border bg-[#161616] border-[#6a6a6a] lg:col-span-3 h-[250px]"></div>

        <div className="border bg-[#161616] border-[#6a6a6a] lg:row-span-full lg:col-start-4 h-full"></div>
      </div>
    </div>
  );
};

export default TradeConsole;
