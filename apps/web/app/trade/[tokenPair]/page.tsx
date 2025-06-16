import React from "react";
import TradeTokenHeading from "../_components/heading";

import { getQueryClient } from "@/lib/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTradeData, getOrderBookData } from "@/lib/api/market-api";
import TradeConsole from "../_components/TradeConsole";
// import { getTradeTokenBalance } from "@/lib/api/user-api";

type Params = Promise<{ tokenPair: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const Trade = async ({ searchParams, params }: { params: Params; searchParams: SearchParams }) => {
  const resolvedSearchParams = await searchParams;
  const resolvedParams = await params;

  const tokenPair = resolvedParams?.tokenPair || "BNB_USDT";
  const modeParam = resolvedSearchParams?.mode;
  const mode = Array.isArray(modeParam) ? modeParam[0] : modeParam || "SPOT";

  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["tokenTradeData", tokenPair],
    queryFn: () => getTradeData(tokenPair),
  });

  queryClient.prefetchQuery({
    queryKey: ["orderBookData", tokenPair],
    queryFn: () => getOrderBookData(tokenPair),
  });

  return (
    <div className="flex flex-col justify-center items-center relative container px-2 pt-5 gap-2">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TradeTokenHeading tokenPair={tokenPair} mode={mode} />
        <TradeConsole tokenPair={tokenPair} mode={mode} />
      </HydrationBoundary>
    </div>
  );
};

export default Trade;
