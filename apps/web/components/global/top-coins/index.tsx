"use client";
import { useMarketData } from "@/hooks/useMarketData";
import Image from "next/image";

export type TokenItem = {
  symbol: string;
  icons: string;
  price: string;
  change: string;
};

export type TokenCategory = {
  title: string;
  token: TokenItem[];
};

export type TopCoinSchema = {
  status: "success" | "error";
  data: TokenCategory[];
};

// const tokenData: TopCoinSchema = {
//   status: "success",
//   data: [
//     {
//       title: "Top Volume",
//       token: [
//         {
//           symbol: "BTC",
//           icons: "https://bin.bnbstatic.com/static/assets/logos/BTC.png",
//           price: "10295.47292",
//           change: "2.5",
//         },
//         {
//           symbol: "ETH",
//           icons: "https://bin.bnbstatic.com/static/assets/logos/ETH.png",
//           price: "10295",
//           change: "2.5",
//         },
//         {
//           symbol: "SOL",
//           icons: "https://bin.bnbstatic.com/static/assets/logos/SOL.png",
//           price: "10295",
//           change: "2.5",
//         },
//       ],
//     },

//     {
//       title: "Top Gainer",
//       token: [
//         {
//           symbol: "BTC",
//           icons: "https://bin.bnbstatic.com/static/assets/logos/BTC.png",
//           price: "10295.47292",
//           change: "2.5",
//         },
//         {
//           symbol: "ETH",
//           icons: "https://bin.bnbstatic.com/static/assets/logos/ETH.png",
//           price: "10295",
//           change: "2.5",
//         },
//         {
//           symbol: "SOL",
//           icons: "https://bin.bnbstatic.com/static/assets/logos/SOL.png",
//           price: "10295",
//           change: "2.5",
//         },
//       ],
//     },
//   ],
// };

const TopCoins = () => {
  const { marketData, isLoading } = useMarketData();

  if (isLoading || !marketData) return <div>Loading...</div>;

  // Top 3 by volume_24hr
  const topVolume = [...marketData.data]
    .sort((a, b) => b.volume_24hr - a.volume_24hr)
    .slice(0, 3)
    .map((token) => ({
      symbol: token.symbol,
      icons: token.icon,
      price: token?.price?.toString(),
      change: (token.change_1d * 100).toFixed(2), // convert to percentage
    }));

  // Top 3 gainers by 1d percent
  const topGainer = [...marketData.data]
    .sort((a, b) => b.change_1d - a.change_1d)
    .slice(0, 3)
    .map((token) => ({
      symbol: token.symbol,
      icons: token.icon,
      price: token?.price?.toString(),
      change: (token.change_1d * 100).toFixed(2), // convert to percentage
    }));

  const tokenData: TopCoinSchema = {
    status: "success",
    data: [
      { title: "Top Gainer", token: topGainer },
      { title: "Top Volume", token: topVolume },
    ],
  };

  return (
    <div className="p-0 rounded-none border-none bg-none">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
        {tokenData?.data.map((data, index) => {
          return (
            <div key={index} className="border p-4 rounded-lg bg-[#141414] overflow-x-auto">
              <span className="text-white text-[15px] font-semibold pb-2 ">{data.title}</span>

              <div className="w-full grid gap-4 mt-3">
                {data.token.map((tokenData, index) => {
                  return (
                    <div key={index} className="grid gap-2 text-white">
                      <div className="flex gap-2 justify-between items-center">
                        <div className="flex gap-2 items-center">
                          <Image
                            src={tokenData.icons}
                            alt={tokenData.symbol}
                            width={50}
                            height={50}
                            className="w-[28px] h-[28px] rounded-full"
                          />
                          <span className="text-[14px] font-semibold">{tokenData.symbol}</span>
                        </div>

                        <span className="text-[14px]">
                          {Number(tokenData.price).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumSignificantDigits: 7,
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                        <span
                          className={
                            Number(tokenData.change) < 0 ? "text-[#f6465d] text-[14px]" : " text-[#0ecb81] text-[14px]"
                          }
                        >
                          {Number(tokenData.change).toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })}
                          %
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopCoins;
