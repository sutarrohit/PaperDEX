import { queryOptions } from "@tanstack/react-query";

export const getTokenPrice = queryOptions({
  queryKey: ["token-price"],
  queryFn: async () => {
    const response = await fetch("http://localhost:4002/api/v1/token/tokenPrice");
    return response.json();
  },
});
