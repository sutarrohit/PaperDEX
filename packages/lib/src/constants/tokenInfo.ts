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
    id: crypto.randomUUID(),
    name: "Bitcoin",
    symbol: "BTC",
    icon: "https://bin.bnbstatic.com/static/assets/logos/BTC.png",
  },
  {
    id: crypto.randomUUID(),
    name: "Ethereum",
    symbol: "ETH",
    icon: "https://bin.bnbstatic.com/static/assets/logos/ETH.png",
  },
  {
    id: crypto.randomUUID(),
    name: "Tether",
    symbol: "USDT",
    icon: "https://bin.bnbstatic.com/static/assets/logos/USDT.png",
  },
  {
    id: crypto.randomUUID(),
    name: "BNB",
    symbol: "BNB",
    icon: "https://bin.bnbstatic.com/static/assets/logos/BNB.png",
  },
  {
    id: crypto.randomUUID(),
    name: "Solana",
    symbol: "SOL",
    icon: "https://bin.bnbstatic.com/static/assets/logos/SOL.png",
  },
  {
    id: crypto.randomUUID(),
    name: "XRP",
    symbol: "XRP",
    icon: "https://bin.bnbstatic.com/static/assets/logos/XRP.png",
  },
  {
    id: crypto.randomUUID(),
    name: "Cardano",
    symbol: "ADA",
    icon: "https://bin.bnbstatic.com/static/assets/logos/ADA.png",
  },
  {
    id: crypto.randomUUID(),
    name: "Avalanche",
    symbol: "AVAX",
    icon: "https://bin.bnbstatic.com/static/assets/logos/AVAX.png",
  },
  {
    id: crypto.randomUUID(),
    name: "Polkadot",
    symbol: "DOT",
    icon: "https://bin.bnbstatic.com/static/assets/logos/DOT.png",
  },
  {
    id: crypto.randomUUID(),
    name: "Chainlink",
    symbol: "LINK",
    icon: "https://bin.bnbstatic.com/static/assets/logos/LINK.png",
  },
  {
    id: crypto.randomUUID(),
    name: "TRON",
    symbol: "TRX",
    icon: "https://bin.bnbstatic.com/static/assets/logos/TRX.png",
  },
  {
    id: crypto.randomUUID(),
    name: "Polygon",
    symbol: "MATIC",
    icon: "https://bin.bnbstatic.com/static/assets/logos/MATIC.png",
  },
  {
    id: crypto.randomUUID(),
    name: "Litecoin",
    symbol: "LTC",
    icon: "https://bin.bnbstatic.com/static/assets/logos/LTC.png",
  },
  {
    id: crypto.randomUUID(),
    name: "Shiba Inu",
    symbol: "SHIB",
    icon: "https://bin.bnbstatic.com/static/assets/logos/SHIB.png",
  },
  {
    id: crypto.randomUUID(),
    name: "Uniswap",
    symbol: "UNI",
    icon: "https://bin.bnbstatic.com/static/assets/logos/UNI.png",
  },
  {
    id: crypto.randomUUID(),
    name: "Cosmos",
    symbol: "ATOM",
    icon: "https://bin.bnbstatic.com/static/assets/logos/ATOM.png",
  },
  {
    id: crypto.randomUUID(),
    name: "Monero",
    symbol: "XMR",
    icon: "https://bin.bnbstatic.com/static/assets/logos/XMR.png",
  },
  {
    id: crypto.randomUUID(),
    name: "NEAR Protocol",
    symbol: "NEAR",
    icon: "https://bin.bnbstatic.com/static/assets/logos/NEAR.png",
  },
  {
    id: crypto.randomUUID(),
    name: "Aptos",
    symbol: "APT",
    icon: "https://bin.bnbstatic.com/static/assets/logos/APT.png",
  },
];
