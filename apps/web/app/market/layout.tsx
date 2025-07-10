import React from "react";
import LandingPageNavbar from "../(landing)/_components/navbar";
import { getQueryClient } from "@/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getMarketData } from "@/lib/api/market-api";

type Props = {
  children: React.ReactNode;
};

const LayoutMarket = ({ children }: Props) => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery({
    queryKey: ["market-table", 0, 10],
    queryFn: () => getMarketData(0, 10),
  });

  return (
    <div className="w-full min-h-screen flex justify-center">
      <div className="container">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <LandingPageNavbar />
        </HydrationBoundary>
        {children}
      </div>
    </div>
  );
};

export default LayoutMarket;
