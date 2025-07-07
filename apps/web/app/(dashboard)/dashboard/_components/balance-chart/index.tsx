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

export const description = "An interactive area chart";

const chartData = [
  { date: "2024-04-01", totalBalance: 9346 },
  { date: "2024-04-02", totalBalance: 7346 },
  { date: "2024-04-03", totalBalance: 8346 },
  { date: "2024-04-04", totalBalance: 2000 },
  { date: "2024-04-05", totalBalance: 8100 },
  { date: "2024-04-06", totalBalance: 8346 },
  { date: "2024-04-07", totalBalance: 5082 },
];

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
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
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

  return (
    <Card className="pt-0 h-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row p-4">
        <div className="grid flex-1 gap-1">
          <CardTitle>Total Balance Overview</CardTitle>
          <CardDescription>Showing total balance changes over the selected time range</CardDescription>
        </div>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex" aria-label="Select a value">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="p-4 lg:pl-0 h-full">
        <ChartContainer config={chartConfig} className="aspect-auto w-full h-full ">
          <AreaChart data={filteredData}>
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
              minTickGap={32}
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
