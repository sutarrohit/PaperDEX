// components/global/TradeTokenHeadingClient.tsx
"use client";

import dynamic from "next/dynamic";

// Dynamically import the actual component with SSR disabled
const TradeTokenHeading = dynamic(() => import("../../../../components/global/trade-token"), {
  ssr: false,
});

export default TradeTokenHeading;
