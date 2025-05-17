"use client";
import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getTradeData } from "@/lib/api/market-api";
import Image from "next/image";
import { tokenInfoType } from "../../../../../packages/lib/src/constants/tokenInfo";
import { formatDate } from "@/utils/formatDate";
import { Separator } from "@/components/ui/separator";
import numeral from "numeral";

type Props = {
  tokenPair: string;
  type?: string;
};

type data = {
  status: string;
  data: tokenInfoType;
};

const TradeTokenHeading = ({ tokenPair, type }: Props) => {
  const { data } = useSuspenseQuery<data>({
    queryKey: ["tokenTradeData", tokenPair],
    queryFn: () => getTradeData(tokenPair),
    refetchInterval: 5000,
  });

  console.log("type", type);

  return (
    <div className="w-full bg-[#161616] text-nowrap">
      {!data?.data ? (
        <div>Data Not available</div>
      ) : (
        <div className="w-full flex gap-4 overflow-x-auto py-4 px-2 items-center">
          <div className="flex gap-3 items-center min-w-[120px]">
            <Image src={data?.data.icon} alt={data?.data.token as string} width={50} height={50} className="w-8 h-8" />
            <div className="flex flex-col gap-0">
              <span className="text-[15px]">{data.data.token}</span>
              <span className=" text-[12px] text-[#6A6A6A]">{formatDate()}</span>
            </div>
            <Separator orientation="vertical" className="ml-2" />
          </div>

          <div className="flex justify-center gap-6">
            <div className="flex flex-col gap-0">
              <span className=" text-[14px] text-[#6A6A6A]">Price</span>
              <span className="text-[15px]">
                {data.data.price?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </div>

            <div className="flex flex-col gap-0">
              <span className="text-[14px] text-[#6A6A6A]">24h Changes</span>
              <span
                className={`text-[15px] ${(data?.data?.change_1d as number) < 0 ? "text-[#f6465d]" : "text-[#0ecb81]"}`}
              >
                {data?.data?.change_1d?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                %
              </span>
            </div>

            <div className="flex flex-col gap-0">
              <span className=" text-[14px] text-[#6A6A6A]">24h High</span>
              <span className="text-[15px]">
                {data?.data?.high_24hr?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </div>

            <div className="flex flex-col gap-0">
              <span className=" text-[14px] text-[#6A6A6A]">24h Low</span>
              <span className="text-[15px]">
                {data?.data?.low_24hr?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </div>

            <div className="flex flex-col gap-0">
              <span className=" text-[14px] text-[#6A6A6A]">Market Cap</span>
              <span className="text-[15px]">{numeral(data?.data?.market_cap).format("0.00a").toUpperCase()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeTokenHeading;
