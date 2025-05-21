import { Separator } from "@/components/ui/separator";
import React from "react";

type Order = [string, string]; // [price, quantity]

interface OrderBookProps {
  bids: Order[];
  asks: Order[];
  tokenPair: string;
  lastPrice: string;
}

const OrderBookComponent: React.FC<OrderBookProps> = ({ bids, asks, tokenPair, lastPrice }) => {
  const [base, quote] = tokenPair.split("_");

  // Get visible orders
  const visibleAsks = asks?.slice(0, 7) || [];
  const visibleBids = bids?.slice(0, 7) || [];

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
    <div className="w-full h-full text-sm bg-[#161616] text-white p-4 rounded flex flex-col items-centers justify-center">
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
              className="relative flex justify-between px-1  py-[2px] w-full overflow-hidden text-[13px]"
            >
              <div
                className="absolute h-full bg-[#321615] opacity-80 z-0 right-0 top-0 transition-all duration-200 ease-in-out"
                style={{ width: `${widthPercent}%` }}
              />
              <span className="text-[#B65170] z-10">
                {parseFloat(price).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 8,
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
        {parseFloat(lastPrice).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 8,
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
              className="relative flex justify-between px-1 py-[2px] w-full overflow-hidden text-[13px]"
            >
              <div
                className="absolute h-full bg-[#153132] opacity-80 z-0 right-0 top-0 transition-all duration-200 ease-in-out"
                style={{ width: `${widthPercent}%` }}
              />
              <span className="text-green-400 z-10">
                {parseFloat(price).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 8,
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
    </div>
  );
};

export default OrderBookComponent;
