import { randomUUID } from "crypto";

export type IntervalKey = "change_1hr" | "change_1d" | "change_1w";

export type TokenPriceStoreType = {
  token?: string;
  price?: number;
  market_cap?: number;
  volume_24hr?: number;
  high_24hr?: number;
  low_24hr?: number;
} & Partial<Record<IntervalKey, number>>;

export type tokenInfoType = {
  id: string;
  name: string;
  symbol: string;
  icon: string;
} & Partial<TokenPriceStoreType>;

export const tokenInfo: tokenInfoType[] = [
  {
    id: randomUUID(),
    name: "Bitcoin",
    symbol: "BTC",
    icon: "https://bin.bnbstatic.com/static/assets/logos/BTC.png",
  },
  {
    id: randomUUID(),
    name: "Ethereum",
    symbol: "ETH",
    icon: "https://bin.bnbstatic.com/static/assets/logos/ETH.png",
  },
  {
    id: randomUUID(),
    name: "Tether",
    symbol: "USDT",
    icon: "https://bin.bnbstatic.com/static/assets/logos/USDT.png",
  },
  {
    id: randomUUID(),
    name: "BNB",
    symbol: "BNB",
    icon: "https://bin.bnbstatic.com/static/assets/logos/BNB.png",
  },
  {
    id: randomUUID(),
    name: "Solana",
    symbol: "SOL",
    icon: "https://bin.bnbstatic.com/static/assets/logos/SOL.png",
  },
  {
    id: randomUUID(),
    name: "XRP",
    symbol: "XRP",
    icon: "https://bin.bnbstatic.com/static/assets/logos/XRP.png",
  },
  {
    id: randomUUID(),
    name: "Cardano",
    symbol: "ADA",
    icon: "https://bin.bnbstatic.com/static/assets/logos/ADA.png",
  },
  {
    id: randomUUID(),
    name: "Avalanche",
    symbol: "AVAX",
    icon: "https://bin.bnbstatic.com/static/assets/logos/AVAX.png",
  },
  {
    id: randomUUID(),
    name: "Polkadot",
    symbol: "DOT",
    icon: "https://bin.bnbstatic.com/static/assets/logos/DOT.png",
  },
  {
    id: randomUUID(),
    name: "Chainlink",
    symbol: "LINK",
    icon: "https://bin.bnbstatic.com/static/assets/logos/LINK.png",
  },
  {
    id: randomUUID(),
    name: "TRON",
    symbol: "TRX",
    icon: "https://bin.bnbstatic.com/static/assets/logos/TRX.png",
  },
  {
    id: randomUUID(),
    name: "Polygon",
    symbol: "MATIC",
    icon: "https://bin.bnbstatic.com/static/assets/logos/MATIC.png",
  },
  {
    id: randomUUID(),
    name: "Litecoin",
    symbol: "LTC",
    icon: "https://bin.bnbstatic.com/static/assets/logos/LTC.png",
  },
  {
    id: randomUUID(),
    name: "Shiba Inu",
    symbol: "SHIB",
    icon: "https://bin.bnbstatic.com/static/assets/logos/SHIB.png",
  },
  {
    id: randomUUID(),
    name: "Uniswap",
    symbol: "UNI",
    icon: "https://bin.bnbstatic.com/static/assets/logos/UNI.png",
  },
  {
    id: randomUUID(),
    name: "Cosmos",
    symbol: "ATOM",
    icon: "https://bin.bnbstatic.com/static/assets/logos/ATOM.png",
  },
  {
    id: randomUUID(),
    name: "Monero",
    symbol: "XMR",
    icon: "https://bin.bnbstatic.com/static/assets/logos/XMR.png",
  },
  {
    id: randomUUID(),
    name: "NEAR Protocol",
    symbol: "NEAR",
    icon: "https://bin.bnbstatic.com/static/assets/logos/NEAR.png",
  },
  {
    id: randomUUID(),
    name: "Aptos",
    symbol: "APT",
    icon: "https://bin.bnbstatic.com/static/assets/logos/APT.png",
  },
];
