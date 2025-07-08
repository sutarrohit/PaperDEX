"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  // ChartLegend,
  // ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getDailyBalance } from "@/lib/api/user-api";

export const description = "An interactive area chart";

// const chartData = [
//   { date: "2024-04-01", totalBalance: 9346 },
//   { date: "2024-04-02", totalBalance: 7346 },
//   { date: "2024-04-03", totalBalance: 8346 },
//   { date: "2024-04-04", totalBalance: 2000 },
//   { date: "2024-04-05", totalBalance: 8100 },
//   { date: "2024-04-06", totalBalance: 8346 },
//   { date: "2024-04-07", totalBalance: 5082 },
// ];

type DailyBalanceResponseSchema = {
  status: "success";
  data: {
    date: string; // Format: "YYYY-MM-DD"
    totalBalance: number;
  }[];
};

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  totalBalance: {
    label: "totalBalance",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function BalanceChart() {
  const [timeRange, setTimeRange] = React.useState("7d");

  const {
    data: chartData,
    isLoading,
    // isError,
  } = useQuery<DailyBalanceResponseSchema>({
    queryKey: ["order-history"],
    queryFn: () => getDailyBalance(),
  });

  const referenceDate = new Date();

  const filteredData = chartData?.data?.filter((item) => {
    const date = new Date(item.date);
    const startDate = new Date(referenceDate);

    let daysToSubtract = 90;
    // if (timeRange === "1d") {
    //   daysToSubtract = 1;
    // } else
    if (timeRange === "7d") {
      daysToSubtract = 7;
    } else if (timeRange === "30d") {
      daysToSubtract = 30;
    }

    startDate.setDate(referenceDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  function useIsLargeScreen() {
    const [isLarge, setIsLarge] = React.useState(false);

    React.useEffect(() => {
      const check = () => setIsLarge(window.innerWidth >= 1024); // Tailwind 'lg' breakpoint
      check();
      window.addEventListener("resize", check);
      return () => window.removeEventListener("resize", check);
    }, []);

    return isLarge;
  }

  const isLargeScreen = useIsLargeScreen();

  if (isLoading)
    return (
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
    );

  return (
    <Card className="pt-0 h-full border-none">
      <CardHeader className="flex flex-col sm:items-center gap-2 space-y-0 border-b sm:flex-row p-4">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-[14px]">Total Balance Overview</CardTitle>
          <CardDescription className="hidden xl:block">
            Showing total balance changes over the selected time range
          </CardDescription>
        </div>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px]  rounded-lg sm:ml-auto sm:flex" aria-label="Select a value">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectContent className="rounded-xl">
              {/* <SelectItem value="1d" className="rounded-lg">
                Last 1 day
              </SelectItem> */}
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="90d" className="rounded-lg">
                Last 90 days
              </SelectItem>
            </SelectContent>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="p-0 lg:pl-0 h-full">
        <ChartContainer config={chartConfig} className="aspect-auto w-full h-full ">
          <AreaChart data={filteredData} margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-totalBalance)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-totalBalance)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />

            {isLargeScreen && (
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                padding="no-gap"
                className="hidden lg:block w-fit border p-0"
              />
            )}

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              minTickGap={isLargeScreen ? 32 : 4}
              allowDuplicatedCategory={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="totalBalance"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-totalBalance)"
              stackId="a"
            />
            {/* <Area dataKey="desktop" type="natural" fill="url(#fillDesktop)" stroke="var(--color-desktop)" stackId="a" /> */}
            {/* <ChartLegend content={ChartLegendContent} /> */}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
