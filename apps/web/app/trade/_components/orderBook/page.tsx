"use client";

import OrderBookComponent from "@/components/global/order-book";
import { getOrderBookData } from "@/lib/api/market-api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export type OrderBookSide = [string, string][];
export interface OrderBookData {
  bids: OrderBookSide;
  asks: OrderBookSide;
}

type ResponseData = {
  status: string;
  data: OrderBookData;
};

const OrderBook = ({ tokenPair }: { tokenPair: string }) => {
  const { data: initialData } = useSuspenseQuery<ResponseData>({
    queryKey: ["orderBookData", tokenPair],
    queryFn: () => getOrderBookData(tokenPair),
  });

  const [liveData, setLiveData] = useState<OrderBookData | null>(null);

  useEffect(() => {
    const normalizedToken = tokenPair.split("_").join("").toLowerCase();
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_ORDER_SERVICE}/stream/orderbook?pair=${tokenPair}`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data[normalizedToken]) {
          setLiveData(data[normalizedToken]);
        }
      } catch (err) {
        console.error("WebSocket error:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => ws.close();
  }, [tokenPair]);

  const orderBook = liveData || initialData.data;

  return (
    <div className="bg-[#161616] flex items-center justify-center h-full w-full rounded-md ">
      <OrderBookComponent bids={orderBook?.bids || []} asks={orderBook?.asks || []} tokenPair={tokenPair} />
    </div>
  );
};

export default OrderBook;
