import { handleResponse } from "@/utils/handleResponse";

const ORDER_SERVICE_URL = process.env.NEXT_PUBLIC_ORDER_SERVICE;

export const getTokenBalance = async (tokenName: string | null) => {
  const url = tokenName
    ? `${ORDER_SERVICE_URL}/api/v1/user/token-balance?tokenName=${encodeURIComponent(tokenName)}`
    : `${ORDER_SERVICE_URL}/api/v1/user/token-balance`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return handleResponse(response);
};

export const getDashboardStats = async () => {
  try {
    const response = await fetch(`${ORDER_SERVICE_URL}/api/v1/user/dashboard-stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Failed to fetch market data:", error);
    return { status: "error", data: [] };
  }
};

export const getUserStats = async () => {
  try {
    const response = await fetch(`${ORDER_SERVICE_URL}/api/v1/user/account-stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Failed to fetch market data:", error);
    return { status: "error", data: [] };
  }
};

export const getDailyBalance = async () => {
  try {
    const response = await fetch(`${ORDER_SERVICE_URL}/api/v1/user/user-daily-balance`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Failed to fetch market data:", error);
    return { status: "error", data: [] };
  }
};
