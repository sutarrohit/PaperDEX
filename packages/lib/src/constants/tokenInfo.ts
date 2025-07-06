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
    name: "BNB",
    symbol: "BNB",
    icon: "https://bin.bnbstatic.com/static/assets/logos/BNB.png",
  },
  {
    id: randomUUID(),
    name: "Tether",
    symbol: "USDT",
    icon: "https://bin.bnbstatic.com/static/assets/logos/USDT.png",
  },
  {
    id: randomUUID(),
    name: "Solana",
    symbol: "SOL",
    icon: "https://bin.bnbstatic.com/static/assets/logos/SOL.png",
  },
  {
    id: randomUUID(),
    name: "Cardano",
    symbol: "ADA",
    icon: "https://bin.bnbstatic.com/static/assets/logos/ADA.png",
  },
  {
    id: randomUUID(),
    name: "XRP",
    symbol: "XRP",
    icon: "https://bin.bnbstatic.com/static/assets/logos/XRP.png",
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
    name: "Avalanche",
    symbol: "AVAX",
    icon: "https://bin.bnbstatic.com/static/assets/logos/AVAX.png",
  },
  {
    id: randomUUID(),
    name: "TRON",
    symbol: "TRX",
    icon: "https://bin.bnbstatic.com/static/assets/logos/TRX.png",
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
  {
    id: randomUUID(),
    name: "Optimism",
    symbol: "OP",
    icon: "https://bin.bnbstatic.com/static/assets/logos/OP.png",
  },
  {
    id: randomUUID(),
    name: "Dogecoin",
    symbol: "DOGE",
    icon: "https://bin.bnbstatic.com/static/assets/logos/DOGE.png",
  },
  {
    id: randomUUID(),
    name: "PancakeSwap",
    symbol: "CAKE",
    icon: "https://bin.bnbstatic.com/static/assets/logos/CAKE.png",
  },

  {
    id: randomUUID(),
    name: "Filecoin",
    symbol: "FIL",
    icon: "https://bin.bnbstatic.com/static/assets/logos/FIL.png",
  },
  {
    id: randomUUID(),
    name: "Stellar",
    symbol: "XLM",
    icon: "https://bin.bnbstatic.com/static/assets/logos/XLM.png",
  },
  {
    id: randomUUID(),
    name: "Ethereum Classic",
    symbol: "ETC",
    icon: "https://bin.bnbstatic.com/static/assets/logos/ETC.png",
  },
  {
    id: randomUUID(),
    name: "Algorand",
    symbol: "ALGO",
    icon: "https://bin.bnbstatic.com/static/assets/logos/ALGO.png",
  },
  {
    id: randomUUID(),
    name: "Arbitrum",
    symbol: "ARB",
    icon: "https://bin.bnbstatic.com/static/assets/logos/ARB.png",
  },
  {
    id: randomUUID(),
    name: "VeChain",
    symbol: "VET",
    icon: "https://bin.bnbstatic.com/static/assets/logos/VET.png",
  },
  {
    id: randomUUID(),
    name: "Internet Computer",
    symbol: "ICP",
    icon: "https://bin.bnbstatic.com/static/assets/logos/ICP.png",
  },
  {
    id: randomUUID(),
    name: "Aave",
    symbol: "AAVE",
    icon: "https://bin.bnbstatic.com/static/assets/logos/AAVE.png",
  },
  {
    id: randomUUID(),
    name: "Axie Infinity",
    symbol: "AXS",
    icon: "https://bin.bnbstatic.com/static/assets/logos/AXS.png",
  },
  {
    id: randomUUID(),
    name: "Decentraland",
    symbol: "MANA",
    icon: "https://bin.bnbstatic.com/static/assets/logos/MANA.png",
  },
  {
    id: randomUUID(),
    name: "The Graph",
    symbol: "GRT",
    icon: "https://bin.bnbstatic.com/static/assets/logos/GRT.png",
  },
  {
    id: randomUUID(),
    name: "The Sandbox",
    symbol: "SAND",
    icon: "https://bin.bnbstatic.com/static/assets/logos/SAND.png",
  },
  {
    id: randomUUID(),
    name: "Theta Network",
    symbol: "THETA",
    icon: "https://bin.bnbstatic.com/static/assets/logos/THETA.png",
  },
  {
    id: randomUUID(),
    name: "Kava",
    symbol: "KAVA",
    icon: "https://bin.bnbstatic.com/static/assets/logos/KAVA.png",
  },
  {
    id: randomUUID(),
    name: "THORChain",
    symbol: "RUNE",
    icon: "https://bin.bnbstatic.com/static/assets/logos/RUNE.png",
  },
  {
    id: randomUUID(),
    name: "Synthetix",
    symbol: "SNX",
    icon: "https://bin.bnbstatic.com/static/assets/logos/SNX.png",
  },

  {
    id: randomUUID(),
    name: "Injective",
    symbol: "INJ",
    icon: "https://bin.bnbstatic.com/static/assets/logos/INJ.png",
  },
  {
    id: randomUUID(),
    name: "Sei Network",
    symbol: "SEI",
    icon: "https://bin.bnbstatic.com/static/assets/logos/SEI.png",
  },
  {
    id: randomUUID(),
    name: "Celestia",
    symbol: "TIA",
    icon: "https://bin.bnbstatic.com/static/assets/logos/TIA.png",
  },
  {
    id: randomUUID(),
    name: "Starknet ",
    symbol: "strk",
    icon: "https://bin.bnbstatic.com/static/assets/logos/STRK.png",
  },

  {
    id: randomUUID(),
    name: "Curve DAO Token",
    symbol: "CRV",
    icon: "https://bin.bnbstatic.com/static/assets/logos/CRV.png",
  },
  {
    id: randomUUID(),
    name: "Zcash",
    symbol: "ZEC",
    icon: "https://bin.bnbstatic.com/static/assets/logos/ZEC.png",
  },
  {
    id: randomUUID(),
    name: "Compound",
    symbol: "COMP",
    icon: "https://bin.bnbstatic.com/static/assets/logos/COMP.png",
  },
  {
    id: randomUUID(),
    name: "Maker",
    symbol: "MKR",
    icon: "https://bin.bnbstatic.com/static/assets/logos/MKR.png",
  },
  {
    id: randomUUID(),
    name: "Gala",
    symbol: "GALA",
    icon: "https://bin.bnbstatic.com/static/assets/logos/GALA.png",
  },
  {
    id: randomUUID(),
    name: "Sui Network",
    symbol: "SUI",
    icon: "https://bin.bnbstatic.com/static/assets/logos/SUI.png",
  },
  {
    id: randomUUID(),
    name: "dogwifcoin",
    symbol: "WIF",
    icon: "https://bin.bnbstatic.com/static/assets/logos/WIF.png", // Note: Verify if Binance has an official logo
  },
  {
    id: randomUUID(),
    name: "Pepe",
    symbol: "PEPE",
    icon: "https://bin.bnbstatic.com/static/assets/logos/PEPE.png", // Note: Verify if Binance has an official logo
  },
  {
    id: randomUUID(),
    name: "Jupiter",
    symbol: "JUP",
    icon: "https://bin.bnbstatic.com/static/assets/logos/JUP.png", // Note: Verify if Binance has an official logo
  },
  {
    id: randomUUID(),
    name: "Pyth Network",
    symbol: "PYTH",
    icon: "https://bin.bnbstatic.com/static/assets/logos/PYTH.png", // Note: Verify if Binance has an official logo
  },
];
