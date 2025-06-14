"use client";

import { Card, CardContent } from "@/components/ui/card";
import TradingPanelForm from "@/components/form/trading-panel";

import { Separator } from "@/components/ui/separator";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getTokenBalance } from "@/lib/api/user-api";
import { GetTradeTokenBalanceResponse } from "@/utils/types";

const TradingPanel = ({ tokenPair, mode }: { tokenPair: string; mode: string }) => {
  const [baseToken, quoteToken] = tokenPair.split("_");
  const tokenName = `${baseToken},${quoteToken}`;

  const { data: balances } = useSuspenseQuery<GetTradeTokenBalanceResponse>({
    queryKey: ["tradeTokenBalance", tokenName],
    queryFn: () => getTokenBalance(tokenName),
  });

  const baseTokenPrice = balances && balances?.data?.balances?.find((token) => token.symbol === baseToken);
  const quoteTokensPrice = balances && balances?.data?.balances?.find((token) => token.symbol === quoteToken);

  return (
    <Card className="w-full rounded-md h-full p-3">
      <CardContent className="p-0">
        <div className="w-full">
          <p className="font-bold text-[#fe8a1d] text-[15px]">Spot</p>
          <Separator className="my-2" />
        </div>

        <TradingPanelForm tokenPair={tokenPair} mode={mode} />

        <Separator className="my-4 " />

        <div className="w-full text-[14px]">
          <div className="flex justify-between gap-2">
            <p>
              Avbl <span className="text-[#5c5c5c] text-[12px]">({quoteToken || "USDT"})</span>
            </p>
            <span>
              {Number(quoteTokensPrice?.balance || 0).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </span>
          </div>

          <div className="flex justify-between gap-2 mt-1">
            <p>
              Avbl <span className="text-[#5c5c5c] text-[12px]">({baseToken || "baseToken"})</span>{" "}
            </p>
            <span>
              {Number(baseTokenPrice?.balance || 0).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 5,
              })}{" "}
              {baseToken}
            </span>
          </div>

          <div className="flex justify-between gap-2 mt-1">
            <span>Fee</span>
            <span>0.0000%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingPanel;
