"use client";

import { getMarketData } from "@/lib/api/market-api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import React from "react";

export const useMarketData = () => {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: marketData,
    isLoading,
    error,
  } = useSuspenseQuery({
    queryKey: ["market-table", pagination.pageIndex, pagination.pageSize],
    queryFn: async () => getMarketData(pagination.pageIndex, pagination.pageSize),
  });

  return {
    pagination,
    setPagination,
    marketData,
    isLoading,
    error,
  };
};
