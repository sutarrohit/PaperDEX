import { fetchKline } from "./kline";
import { fetchTokenPrices } from "./priceService";
import { tokenSet, klineSet_1h, klineSet_1d, klineSet_1w, volumeMcap } from "@paperdex/lib";
import { fetchVolumeMcap } from "./volumeMcap";

export const WSserver = () => {
  fetchTokenPrices(tokenSet);
  fetchKline(klineSet_1h, "change_1hr");
  fetchKline(klineSet_1d, "change_1d");
  fetchKline(klineSet_1w, "change_1w");

  setInterval(() => {
    fetchVolumeMcap(volumeMcap);
  }, 10000);
};
