"use client";
import OrderBookComponent from "@/components/global/order-book";
import { getOrderBookData } from "@/lib/api/market-api";
import { useSuspenseQuery } from "@tanstack/react-query";
import {} from "@/lib/api/market-api";

export type OrderBookSide = [string, string][];
export interface OrderBookData {
  bids: OrderBookSide;
  asks: OrderBookSide;
}

type data = {
  status: string;
  data: OrderBookData;
};

const OrderBook = ({ tokenPair }: { tokenPair: string }) => {
  const { data } = useSuspenseQuery<data>({
    queryKey: ["orderBookData", tokenPair],
    queryFn: () => getOrderBookData(tokenPair),
    refetchInterval: 4000,
  });

  return (
    <div className="bg-[#161616] flex items-center justify-center h-full w-full rounded-md">
      <OrderBookComponent
        bids={data?.data?.bids || []}
        asks={data?.data?.asks || []}
        tokenPair={tokenPair}
        lastPrice="2398.71"
      />
    </div>
  );
};

export default OrderBook;
