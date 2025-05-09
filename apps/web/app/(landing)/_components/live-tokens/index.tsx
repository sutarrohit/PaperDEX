"use client";
import BackdropGradient from "@/components/global/backdrop-gradient";
import GradientText from "@/components/global/gradient-text";
import { liveTokenSet } from "@/constants";
import Image from "next/image";
import GradientButton from "@/components/global/gradient-button";
import { getTokenPrice } from "./fetch";
import { useSuspenseQuery } from "@tanstack/react-query";

const LiveToken = () => {
  const { data } = useSuspenseQuery({ ...getTokenPrice, refetchInterval: 5000 });

  return (
    <div className="flex flex-col w-[95%] md:w-full items-center justify-center gap-10 pb-20">
      <GradientText className="text-[40px] sm:text-[45px] md:text-[50px] font-bold text-center leading-tight">
        Live Tokens
      </GradientText>

      <div className="w-full md:w-[90%] lg:w-[80%] xl:w-[55%] h-[500px]">
        <BackdropGradient className="w-full h-full opacity-20  mx-0 items-center md:top-[-40px] md:left-[-250px]">
          <div className="flex w-full border bg-black/0 backdrop-blur-sm rounded-[20px] overflow-x-auto overflow-y-auto hide-scrollbar shadow-2xl">
            <div className="w-full flex flex-col h-[500px] px-2 py-4 md:p-4">
              {liveTokenSet?.map((token, index) => {
                return (
                  <div key={index} className="w-full px-2 py-4 md:p-4 flex justify-between gap-4">
                    <div className="flex items-center gap-2 min-w-[220px]">
                      <span className="pr-3">{index + 1}. </span>

                      <Image
                        src={token?.icon}
                        alt={token?.name}
                        width={40}
                        height={40}
                        className="w-[30px] h-[30px] rounded-full"
                      />
                      <span className="font-semibold text-[14px]">{token?.name}</span>
                      <span className="text-[12px] text-muted-foreground">{token?.symbol}</span>
                    </div>

                    <div className="min-w-[100px] max-w-[150px] text-start overflow-x-scroll hide-scrollbar">
                      {data?.data.find((tokenPrice: Record<string, string>) => {
                        return tokenPrice?.token === `${token?.symbol}USDT`;
                      })?.price ?? 0}
                    </div>

                    <div className="min-w-[120px] flex items-center justify-end">
                      <GradientButton name="Buy" link={"/sign-in"} className="h-[30px] w-[90px] md:w-[90px]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </BackdropGradient>
      </div>
    </div>
  );
};

export default LiveToken;
