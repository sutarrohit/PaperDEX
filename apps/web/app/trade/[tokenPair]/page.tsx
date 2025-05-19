import React from "react";
import TradeTokenHeading from "@/components/global/trade-token";

import { getQueryClient } from "@/lib/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTradeData, getOrderBookData } from "@/lib/api/market-api";
import TradeConsole from "../_components/TradeConsole";

type Params = Promise<{ tokenPair: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const Trade = async ({ searchParams, params }: { params: Params; searchParams: SearchParams }) => {
  const resolvedSearchParams = await searchParams;
  const resolvedParams = await params;

  const tokenPair = resolvedParams?.tokenPair || "BNB_USDT";
  const typeParam = resolvedSearchParams?.type;
  const type = Array.isArray(typeParam) ? typeParam[0] : typeParam || "spot";

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
    <div className="flex flex-col justify-center items-center relative container px-2 pt-10 gap-4">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TradeTokenHeading tokenPair={tokenPair} type={type} />
        <TradeConsole tokenPair={tokenPair} />
      </HydrationBoundary>
    </div>
  );
};

export default Trade;
