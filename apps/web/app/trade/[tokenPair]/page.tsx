import React from "react";
import TradeTokenHeading from "@/components/global/trade-token";

import { getQueryClient } from "@/lib/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTradeData } from "@/lib/api/market-api";

const Trade = async ({
  searchParams,
  params,
}: {
  params: { tokenPair: string };
  searchParams: { [key: string]: string | undefined };
}) => {
  const resolvedSearchParams = await searchParams;
  const resolvedParams = await params;

  const tokenPair = resolvedParams?.tokenPair || "BNB_USDT";
  const type = resolvedSearchParams?.type || "spot";

  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["tokenTradeData", tokenPair],
    queryFn: () => getTradeData(tokenPair),
  });

  return (
    <div className="flex flex-col justify-center items-center relative container px-2 pt-4">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TradeTokenHeading tokenPair={tokenPair} type={type} />
      </HydrationBoundary>
    </div>
  );
};

export default Trade;
