"use client";

import { getDashboardStats, getTokenBalance } from "@/lib/api/user-api";
import { useQuery } from "@tanstack/react-query";

export type GetUserBalancesResponse = {
  status: "success";
  data: {
    id: string;
    userId: string;
    balances: {
      id: string;
      name: string;
      symbol: string;
      balance: string;
      icon: string;
      walletId: string;
    }[];
  };
};

export type TokenDetail = {
  name: string;
  symbol: string;
  icon: string;
  balance: number;
  value: number;
};

export type TopHoldingResponse = {
  status: "success";
  data: {
    topHolding: TokenDetail;
    usdt: TokenDetail;
  };
};

export const useDashboard = () => {
  const {
    data: userData,
    isLoading: userIsLoading,
    isError: userIsError,
  } = useQuery<GetUserBalancesResponse>({
    queryKey: ["Total-Token-Balance"],
    queryFn: async () => getTokenBalance(null),
  });

  const {
    data: dashboardData,
    isLoading: dashboardIsLoading,
    isError: dashboardIsError,
  } = useQuery<TopHoldingResponse>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => getDashboardStats(),
  });

  return {
    userData,
    userIsLoading,
    userIsError,

    dashboardData,
    dashboardIsLoading,
    dashboardIsError,
  };
};
