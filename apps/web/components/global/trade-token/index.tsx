"use client";
import React, { useEffect } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getTradeData } from "@/lib/api/market-api";
import Image from "next/image";
import { tokenInfoType } from "../../../../../packages/lib/src/constants/tokenInfo";
import { formatDate } from "@/utils/formatDate";
import numeral from "numeral";
import { useTradeTokenStore } from "@/store/tradeToken";

type Props = {
  tokenPair: string;
  mode?: string;
};

type data = {
  status: string;
  data: tokenInfoType;
};

const TradeTokenHeading = ({ tokenPair }: Props) => {
  const { data: initialData } = useSuspenseQuery<data>({
    queryKey: ["tokenTradeData", tokenPair],
    queryFn: () => getTradeData(tokenPair),
  });

  const { updateData, data: tradeTokenStore } = useTradeTokenStore();

  useEffect(() => {
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_ORDER_SERVICE}/stream/tokenTrade?token=${tokenPair}`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data) {
          updateData(data.data);
        }
      } catch (err) {
        console.error("WebSocket error:", err);
      }
    };
    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => ws.close();
  }, [tokenPair, updateData]);

  const data = tradeTokenStore || initialData.data;

  return (
    <div className="bg-[#161616] w-full rounded-md border">
      <div className="text-nowrap w-full md:w-fit">
        {!data ? (
          <div>Data Not available</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-6 py-3 px-4 md:px-2 items-center justify-end gap-2 md:gap-1">
            <div className="flex gap-3 items-center">
              <Image
                src={data?.icon}
                alt={(data?.token as string) || "icon"}
                width={50}
                height={50}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex flex-col gap-0">
                <span className="text-[15px]">{data?.token}</span>
                <span className=" text-[12px] text-[#6A6A6A]">{formatDate()}</span>
              </div>
              {/* <Separator orientation="vertical" className="ml-2" /> */}
            </div>

            <div className="flex flex-col gap-0 md:ml-8 items-end md:items-start">
              <span className=" text-[14px] text-[#6A6A6A]">Price</span>
              <span className="text-[15px]">
                {data?.price?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </div>

            <div className="flex flex-col gap-0">
              <span className="text-[14px] text-[#6A6A6A]">24h Changes</span>
              <span className={`text-[15px] ${(data?.change_1d as number) < 0 ? "text-[#f6465d]" : "text-[#0ecb81]"}`}>
                {data?.change_1d?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                %
              </span>
            </div>

            <div className="flex flex-col gap-0 items-end md:items-start">
              <span className=" text-[14px] text-[#6A6A6A]">24h High</span>
              <span className="text-[15px]">
                {data?.high_24hr?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </div>

            <div className="flex flex-col gap-0">
              <span className=" text-[14px] text-[#6A6A6A]">24h Low</span>
              <span className="text-[15px]">
                {data?.low_24hr?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </div>

            <div className="flex flex-col gap-0 items-end md:items-start">
              <span className=" text-[14px] text-[#6A6A6A]">Market Cap</span>
              <span className="text-[15px]">{numeral(data?.market_cap).format("0.00a").toUpperCase()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeTokenHeading;
