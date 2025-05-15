import { getTokenName } from "@paperdex/lib";
import { TokenPriceStore } from "../../store/tokenPriceStore";

type CoinMarket = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string; // ISO date string
  atl: number;
  atl_change_percentage: number;
  atl_date: string; // ISO date string
  roi: null | {
    times: number;
    currency: string;
    percentage: number;
  };
  last_updated: string; // ISO date string
};

export const fetchVolumeMcap = async (volumeMcap: string) => {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${volumeMcap}`);
    const data: CoinMarket[] = await response.json();

    data.map((token) => {
      const tokenName = getTokenName(token.symbol);

      const existing = TokenPriceStore.find((tokenInfo) => tokenInfo?.token === tokenName);

      if (existing) {
        existing.market_cap = token?.market_cap ?? 0;
        existing.volume_24hr = token?.total_volume ?? 0;
      }
    });
  } catch (error) {
    console.log("fetchVolumeMcap Error:", error);
  }
};
