// config.ts
export const API_CONFIG = {
  baseURL: process.env.EXPO_PUBLIC_API_URL_DEV || "https://www.copracess.live",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export const API_ENDPOINTS = {
  transactions: "/api/mobile/transactions",
  auth: "/api/mobile/auth",
};
