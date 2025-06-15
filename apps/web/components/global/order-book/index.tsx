import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { useTradeTokenStore } from "@/store/tradeToken";

type Order = [string, string]; // [price, quantity]

interface OrderBookProps {
  bids: Order[];
  asks: Order[];
  tokenPair: string;
}

const OrderBookComponent: React.FC<OrderBookProps> = ({ bids, asks, tokenPair }) => {
  const [base, quote] = tokenPair.split("_");

  const { data } = useTradeTokenStore();

  // Get visible orders
  const visibleAsks = asks?.slice(0, 8) || [];
  const visibleBids = bids?.slice(0, 8) || [];

  // Calculate max quantity for each side separately
  const maxAskQty = Math.max(...visibleAsks.map(([, qty]) => parseFloat(qty)), 1);
  const maxBidQty = Math.max(...visibleBids.map(([, qty]) => parseFloat(qty)), 1);

  // Normalization function that ensures good visual representation
  const normalizeWidth = (qty: number, maxQty: number) => {
    const rawPercent = (qty / maxQty) * 100;
    // Apply a logarithmic scale to make smaller quantities more visible
    return 28 + 80 * Math.log10(1 + 9 * (rawPercent / 100));
  };

  return (
    <Card className="w-full rounded-md p-3 h-full">
      <CardContent className="p-0">
        <div className="w-full">
          <p className="font-bold text-[#FE8A1D]">Order Book</p>
          <Separator className="my-2" />
        </div>

        <div className="flex justify-between text-gray-400 mb-1 px-1 text-[12px]">
          <span>Price({quote})</span>
          <span>Quantity({base})</span>
        </div>

        {/* Asks (sell orders) - shown from highest to lowest */}
        <div className="flex flex-col-reverse mb-1 gap-[1.5px]">
          {visibleAsks.map(([price, qty], index) => {
            const quantity = parseFloat(qty);
            const widthPercent = normalizeWidth(quantity, maxAskQty);

            return (
              <div
                key={`ask-${index}`}
                className="relative flex justify-between px-1 py-[2px] w-full overflow-hidden text-[12px]"
              >
                <div
                  className="absolute h-full bg-[#321615] opacity-80 z-0 right-0 top-0 transition-all duration-200 ease-in-out"
                  style={{ width: `${widthPercent}%` }}
                />
                <span className="text-[#B65170] z-10">
                  {parseFloat(price).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 8,
                    style: "currency",
                    currency: "USD",
                  })}
                </span>
                <span className="z-10">
                  {quantity.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4,
                  })}
                </span>
              </div>
            );
          })}
        </div>

        {/* Last Price */}
        <p className="text-white w-full text-start font-semibold">
          {(data?.price ?? 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 8,
            style: "currency",
            currency: "USD",
          })}
        </p>

        {/* Bids (buy orders) - shown from highest to lowest */}
        <div className="flex flex-col mt-1 gap-[1.5px]">
          {visibleBids.map(([price, qty], index) => {
            const quantity = parseFloat(qty);
            const widthPercent = normalizeWidth(quantity, maxBidQty);

            return (
              <div
                key={`bid-${index}`}
                className="relative flex justify-between px-1 py-[2px] w-full overflow-hidden text-[12px]"
              >
                <div
                  className="absolute h-full bg-[#153132] opacity-80 z-0 right-0 top-0 transition-all duration-200 ease-in-out"
                  style={{ width: `${widthPercent}%` }}
                />
                <span className="text-green-400 z-10">
                  {parseFloat(price).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 8,
                    style: "currency",
                    currency: "USD",
                  })}
                </span>
                <span className="z-10">
                  {quantity.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4,
                  })}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderBookComponent;
