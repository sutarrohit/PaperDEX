import { columns } from "./columns";
import { DataTable } from "@/components/global/data-table/data-table";
import React from "react";

export type tokenMarket = {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  price: string;
  priceChange_1hr: string;
  priceChange_24hr: string;
  priceChange_30d: string;
  volume_24: string;
  marketCap: string;
};

export const tokenMarketData: tokenMarket[] = [
  {
    id: crypto.randomUUID(),
    name: "Bitcoin",
    symbol: "BTC",
    icon: "https://bin.bnbstatic.com/static/assets/logos/BTC.png",
    price: "$69,420.00",
    priceChange_1hr: "+0.5",
    priceChange_24hr: "+2.3",
    priceChange_30d: "+15.8",
    volume_24: "$32.5B",
    marketCap: "$1.37T",
  },
  {
    id: crypto.randomUUID(),
    name: "Ethereum",
    symbol: "ETH",
    icon: "https://bin.bnbstatic.com/static/assets/logos/ETH.png",
    price: "$3,805.20",
    priceChange_1hr: "+0.2",
    priceChange_24hr: "+1.8",
    priceChange_30d: "+22.4",
    volume_24: "$18.7B",
    marketCap: "$457.2B",
  },
  {
    id: crypto.randomUUID(),
    name: "Tether",
    symbol: "USDT",
    icon: "https://bin.bnbstatic.com/static/assets/logos/USDT.png",
    price: "$1.00",
    priceChange_1hr: "0.0",
    priceChange_24hr: "0.0",
    priceChange_30d: "-0.01",
    volume_24: "$78.3B",
    marketCap: "$110.5B",
  },
  {
    id: crypto.randomUUID(),
    name: "BNB",
    symbol: "BNB",
    icon: "https://bin.bnbstatic.com/static/assets/logos/BNB.png",
    price: "$585.30",
    priceChange_1hr: "-0.3",
    priceChange_24hr: "+0.7",
    priceChange_30d: "+8.5",
    volume_24: "$2.1B",
    marketCap: "$90.1B",
  },
  {
    id: crypto.randomUUID(),
    name: "Solana",
    symbol: "SOL",
    icon: "https://bin.bnbstatic.com/static/assets/logos/SOL.png",
    price: "$172.50",
    priceChange_1hr: "+1.2",
    priceChange_24hr: "+5.4",
    priceChange_30d: "+42.3",
    volume_24: "$3.8B",
    marketCap: "$76.8B",
  },
  {
    id: crypto.randomUUID(),
    name: "XRP",
    symbol: "XRP",
    icon: "https://bin.bnbstatic.com/static/assets/logos/XRP.png",
    price: "$0.52",
    priceChange_1hr: "-0.1",
    priceChange_24hr: "+0.5",
    priceChange_30d: "+3.2",
    volume_24: "$1.5B",
    marketCap: "$28.7B",
  },
  {
    id: crypto.randomUUID(),
    name: "USD Coin",
    symbol: "USDC",
    icon: "https://bin.bnbstatic.com/static/assets/logos/USDC.png",
    price: "$1.00",
    priceChange_1hr: "0.0",
    priceChange_24hr: "0.0",
    priceChange_30d: "+0.01",
    volume_24: "$6.8B",
    marketCap: "$33.2B",
  },
  {
    id: crypto.randomUUID(),
    name: "Cardano",
    symbol: "ADA",
    icon: "https://bin.bnbstatic.com/static/assets/logos/ADA.png",
    price: "$0.45",
    priceChange_1hr: "+0.3",
    priceChange_24hr: "+1.2",
    priceChange_30d: "+10.5",
    volume_24: "$0.8B",
    marketCap: "$15.9B",
  },
  {
    id: crypto.randomUUID(),
    name: "Dogecoin",
    symbol: "DOGE",
    icon: "https://bin.bnbstatic.com/static/assets/logos/DOGE.png",
    price: "$0.15",
    priceChange_1hr: "-0.5",
    priceChange_24hr: "-2.1",
    priceChange_30d: "+5.8",
    volume_24: "$1.2B",
    marketCap: "$21.6B",
  },
  {
    id: crypto.randomUUID(),
    name: "Avalanche",
    symbol: "AVAX",
    icon: "https://bin.bnbstatic.com/static/assets/logos/AVAX.png",
    price: "$36.80",
    priceChange_1hr: "+0.8",
    priceChange_24hr: "+3.5",
    priceChange_30d: "+28.4",
    volume_24: "$0.9B",
    marketCap: "$14.3B",
  },
  {
    id: crypto.randomUUID(),
    name: "Dogecoin",
    symbol: "DOGE",
    icon: "https://bin.bnbstatic.com/static/assets/logos/DOGE.png",
    price: "$0.15",
    priceChange_1hr: "-0.5",
    priceChange_24hr: "-2.1",
    priceChange_30d: "+5.8",
    volume_24: "$1.2B",
    marketCap: "$21.6B",
  },
  {
    id: crypto.randomUUID(),
    name: "Avalanche",
    symbol: "AVAX",
    icon: "https://bin.bnbstatic.com/static/assets/logos/AVAX.png",
    price: "$36.80",
    priceChange_1hr: "+0.8",
    priceChange_24hr: "+3.5",
    priceChange_30d: "+28.4",
    volume_24: "$0.9B",
    marketCap: "$14.3B",
  },
];

const MarketTable = () => {
  return <DataTable columns={columns} data={tokenMarketData} />;
};

export default MarketTable;
