export const supportedTokens = [
  "BTCUSDT", // bitcoin
  "ETHUSDT", // ethereum
  "BNBUSDT", // binancecoin
  "USDTDAI", // tether & dai (combined in your original tokens array)
  "SOLUSDT", // solana
  "ADAUSDT", // cardano
  "XRPUSDT", // ripple
  "DOTUSDT", // polkadot
  "LINKUSDT", // chainlink
  "AVAXUSDT", // avalanche-2
  "TRXUSDT", // tron
  "LTCUSDT", // litecoin
  "SHIBUSDT", // shiba-inu
  "UNIUSDT", // uniswap
  "ATOMUSDT", // cosmos
  "NEARUSDT", // near
  "APTUSDT", // aptos
  "OPUSDT",
  "DOGEUSDT",
  "CAKEUSDT",
];

const allTokens = [...supportedTokens];
// Ensure no duplicates
const uniqueTokens = [...new Set(allTokens)];

const tokenSet = uniqueTokens.map((token) => `${token.toLowerCase()}@trade`).join("/");
const klineSet_1h = uniqueTokens.map((token) => `${token.toLowerCase()}@kline_1h`).join("/");
const klineSet_1d = uniqueTokens.map((token) => `${token.toLowerCase()}@kline_1d`).join("/");
const klineSet_1w = uniqueTokens.map((token) => `${token.toLowerCase()}@kline_1w`).join("/");
const orderBookSet = uniqueTokens.map((token) => `${token.toLowerCase()}@depth20@1000ms`).join("/");
const tokenArraySet = uniqueTokens;

const volumeMcap =
  "bitcoin,ethereum,binancecoin,tether,dai,solana,cardano,ripple,polkadot,chainlink,avalanche-2,tron,litecoin,shiba-inu,uniswap,cosmos,near,aptos,optimism,doge,pancakeswap-token";

export { tokenSet, klineSet_1h, klineSet_1d, klineSet_1w, volumeMcap, orderBookSet, tokenArraySet };
