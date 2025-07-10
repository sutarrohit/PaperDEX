"use client";

import { getTokenBalance } from "@/lib/api/user-api";
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

export const useDashboard = () => {
  const {
    data: userData,
    isLoading: userIsLoading,
    isError: userIsError,
  } = useQuery<GetUserBalancesResponse>({
    queryKey: ["Total-Token-Balance"],
    queryFn: async () => getTokenBalance(null),
  });

  return {
    userData,
    userIsLoading,
    userIsError,
  };
};
