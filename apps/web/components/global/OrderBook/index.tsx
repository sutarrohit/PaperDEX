// import { Separator } from "@/components/ui/separator";
// import React from "react";

// type Order = [string, string]; // [price, quantity]

// interface OrderBookProps {
//   bids: Order[];
//   asks: Order[];
//   tokenPair: string;
//   lastPrice: string;
// }

// const OrderBookComponent: React.FC<OrderBookProps> = ({ bids, asks, tokenPair, lastPrice }) => {
//   const [base, quote] = tokenPair.split("_");

//   // Get max quantity for width scaling
//   const maxBidPrice = Math.max(...bids.map(([price]) => parseFloat(price)));
//   const maxAskPrice = Math.max(...asks.map(([price]) => parseFloat(price)));
//   return (
//     <div className="w-full h-full text-sm bg-[#161616] text-white px-4 py-2 rounded flex flex-col items-centers justify-center">
//       <div className="w-full">
//         <p className="font-bold text-[#FE8A1D]">Order Book</p>
//         <Separator className="my-2" />
//       </div>

//       <div className="flex justify-between text-gray-400 mb-1 px-1 text-[12px]">
//         <span>Price({quote})</span>
//         <span>Quantity({base})</span>
//       </div>

//       {/* Asks (sell orders) - shown from highest to lowest */}
//       <div className="flex flex-col-reverse mb-1">
//         {asks?.slice(0, 8)?.map(([price, qty], index) => {
//           const askPrice = parseFloat(price);
//           const widthPercent = (askPrice / maxAskPrice) * 100;
//           console.log("widthPercent", widthPercent);

//           return (
//             <div key={`ask-${index}`} className={`relative flex justify-between px-1 py-1 w-full`}>
//               <div
//                 className="absolute h-full bg-[#321615] opacity-80 z-0 right-0 top-0 transition-all duration-300 ease-in-out"
//                 style={{ width: `${widthPercent}%` }}
//               />
//               <span className="text-[#B65170] z-10">
//                 {parseFloat(price).toLocaleString("en-US", {
//                   style: "currency",
//                   currency: "USD",
//                 })}
//               </span>
//               <span className="z-10">
//                 {parseFloat(qty).toLocaleString("en-US", {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 4,
//                 })}
//               </span>
//             </div>
//           );
//         })}
//       </div>

//       {/* Last Price */}

//       <p className="text-white w-full text-start font-semibold">
//         {parseFloat(lastPrice).toLocaleString("en-US", {
//           style: "currency",
//           currency: "USD",
//         })}
//       </p>

//       {/* Bids (buy orders) - shown from highest to lowest */}
//       <div className="flex flex-col mt-1">
//         {bids?.slice(0, 8)?.map(([price, qty], index) => {
//           const bidsPrice = parseFloat(price);
//           const widthPercent = ((bidsPrice / maxBidPrice) * 100).toFixed(0);
//           return (
//             <div key={`bid-${index}`} className={`relative flex justify-between px-1 py-1 w-full`}>
//               <div
//                 className="absolute h-full bg-[#153132] opacity-80 z-0 right-0 top-0 transition-all duration-300 ease-in-out"
//                 style={{ width: `${widthPercent}%` }}
//               />

//               <span className="text-green-400 z-10">
//                 {parseFloat(price).toLocaleString("en-US", {
//                   style: "currency",
//                   currency: "USD",
//                 })}
//               </span>
//               <span className="z-10">
//                 {parseFloat(qty).toLocaleString("en-US", {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 4,
//                 })}
//               </span>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default OrderBookComponent;

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

  // --- Corrected Calculation ---
  // Get max quantity for width scaling based on the *visible* orders (sliced)

  // Calculate max quantity for asks
  const visibleAsks = asks?.slice(0, 8) || [];
  const maxAskQuantity = Math.max(...visibleAsks.map(([price]) => parseFloat(price)), 0); // Add 0 in case the array is empty

  // Calculate max quantity for bids
  const visibleBids = bids?.slice(0, 8) || [];
  const maxBidQuantity = Math.max(...visibleBids.map(([price]) => parseFloat(price)), 0); // Add 0 in case the array is empty
  // ---------------------------

  return (
    <div className="w-full h-full text-sm bg-[#161616] text-white p-4  rounded flex flex-col items-centers justify-center">
      <div className="w-full">
        <p className="font-bold text-[#FE8A1D]">Order Book</p>
        <Separator className="my-2" />
      </div>

      <div className="flex justify-between text-gray-400 mb-1 px-1 text-[12px]">
        <span>Price({quote})</span>
        <span>Quantity({base})</span>
      </div>

      {/* Asks (sell orders) - shown from highest to lowest */}
      <div className="flex flex-col-reverse mb-1">
        {visibleAsks.map(([price, qty], index) => {
          const askQty = parseFloat(price);
          // Calculate width based on quantity relative to max ask quantity
          const widthPercent = maxAskQuantity > 0 ? (askQty / maxAskQuantity) * 100 : 0;

          return (
            <div key={`ask-${index}`} className={`relative flex justify-between px-1 py-1 w-full`}>
              <div
                className="absolute h-full bg-[#321615] opacity-80 z-0 right-0 top-0 transition-all duration-200 ease-in-out"
                // Apply calculated width based on quantity
                style={{ width: `${widthPercent}%` }}
              />
              <span className="text-[#B65170] z-10">
                {/* Keep price formatting as is, but remove currency unless quote is always USD */}
                {parseFloat(price).toLocaleString("en-US", {
                  minimumFractionDigits: 2, // Example: ensure at least 2 decimal places for price
                  maximumFractionDigits: 8, // Example: allow more if needed
                })}
              </span>
              <span className="z-10">
                {/* Keep quantity formatting as is */}
                {parseFloat(qty).toLocaleString("en-US", {
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
        {/* Keep last price formatting as is, but remove currency unless quote is always USD */}
        {parseFloat(lastPrice).toLocaleString("en-US", {
          minimumFractionDigits: 2, // Example: ensure at least 2 decimal places
          maximumFractionDigits: 8, // Example: allow more if needed
        })}
      </p>

      {/* Bids (buy orders) - shown from highest to lowest */}
      <div className="flex flex-col mt-1">
        {visibleBids.map(([price, qty], index) => {
          const bidQty = parseFloat(price);
          // Calculate width based on quantity relative to max bid quantity
          const widthPercent = maxBidQuantity > 0 ? (bidQty / maxBidQuantity) * 100 : 0;

          return (
            <div key={`bid-${index}`} className={`relative flex justify-between px-1 py-1 w-full`}>
              <div
                className="absolute h-full bg-[#153132] opacity-80 z-0 right-0 top-0 transition-all duration-200 ease-in-out"
                // Apply calculated width based on quantity
                style={{ width: `${widthPercent}%` }}
              />

              <span className="text-green-400 z-10">
                {/* Keep price formatting as is, but remove currency unless quote is always USD */}
                {parseFloat(price).toLocaleString("en-US", {
                  minimumFractionDigits: 2, // Example: ensure at least 2 decimal places
                  maximumFractionDigits: 8, // Example: allow more if needed
                })}
              </span>
              <span className="z-10">
                {/* Keep quantity formatting as is */}
                {parseFloat(qty).toLocaleString("en-US", {
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
