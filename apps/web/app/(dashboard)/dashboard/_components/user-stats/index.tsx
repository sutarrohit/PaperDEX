"use client";

import { useDashboard } from "@/hooks/dashboard/useDashboard";
import Image from "next/image";

const UserStats = () => {
  const { dashboardData, dashboardIsLoading, dashboardIsError } = useDashboard();

  return (
    <div className="h-full">
      {dashboardIsLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <svg
            aria-hidden="true"
            role="status"
            className="inline mr-2 w-6 h-6 text-gray-200 animate-spin dark:text-gray-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            ></path>
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="#fe8a1d"
            ></path>
          </svg>
          Loading...
        </div>
      ) : (
        <div className="h-full flex flex-col gap-2">
          {dashboardIsError ? (
            <div className="flex items-center justify-center h-full text-wrap text-red-400">Failed to load data.</div>
          ) : (
            dashboardData &&
            dashboardData.data && (
              <div className="h-full flex flex-col lg:flex-row gap-4 p-4 ">
                <div className="border w-full rounded-[8px] h-full flex flex-col justify-between p-4 shadow-lg shadow-[#232222]">
                  <span className="font-semibold text-orange-500">Top Holding</span>

                  <div className="h-full flex flex-col mt-4">
                    <div className="font-bold text-[14px] flex gap-2 items-center">
                      <Image
                        src={dashboardData?.data?.topHolding.icon}
                        alt="dashboardData"
                        width={50}
                        height={50}
                        className="rounded-full w-10 h-10"
                      />

                      <div className="flex flex-col w-full">
                        <span className="text-[15px]">{dashboardData?.data?.topHolding.name}</span>

                        <div className="flex w-full justify-between items-center">
                          <span className="text-[12px]  text-[#787676]">{dashboardData?.data?.topHolding.symbol}</span>
                          <p>
                            {dashboardData?.data?.topHolding.balance.toLocaleString("en-US", {
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-[20px] font-bold mt-8">
                      {dashboardData?.data?.topHolding?.value?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                </div>

                {/* BASE Token */}
                <div className="border w-full rounded-[8px] h-full flex flex-col justify-between p-4 shadow-lg shadow-[#232222]">
                  <span className="font-semibold text-orange-500">BASE Holding</span>

                  <div className="h-full flex flex-col mt-4">
                    <div className="font-bold text-[14px] flex gap-2 items-center">
                      <Image
                        src={dashboardData?.data?.usdt.icon}
                        alt="dashboardData"
                        width={50}
                        height={50}
                        className="rounded-full w-10 h-10"
                      />

                      <div className="flex flex-col w-full">
                        <span className="text-[15px]">{dashboardData?.data?.usdt.name}</span>

                        <div className="flex w-full justify-between items-center">
                          <span className="text-[12px]  text-[#787676]">{dashboardData?.data?.usdt.symbol}</span>
                          <p>
                            {dashboardData?.data?.usdt.balance.toLocaleString("en-US", {
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-[20px] font-bold mt-8">
                      {dashboardData?.data?.usdt?.value?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default UserStats;
