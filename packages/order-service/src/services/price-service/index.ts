import { fetchKline } from "./kline";
import { fetchTokenPrices } from "./priceService";
import { tokenSet, klineSet_1h, klineSet_1d, klineSet_1w } from "@paperdex/lib";

export const WSserver = () => {
  fetchTokenPrices(tokenSet);
  fetchKline(klineSet_1h, "change_1hr");
  fetchKline(klineSet_1d, "change_1d");
  fetchKline(klineSet_1w, "change_1w");
};
