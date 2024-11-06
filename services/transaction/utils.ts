// utils.ts
import axios, { AxiosError } from "axios";
import type { TransactionError } from "./types";

export const handleTransactionError = (error: unknown): TransactionError => {
  if (error instanceof Error && error.message === "AUTH_REQUIRED") {
    return {
      error: "Authentication required. Please login again.",
      status: 401,
    };
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    interface AxiosErrorResponseData {
      error?: string;
    }

    const responseData = axiosError.response?.data as AxiosErrorResponseData;

    console.error("Axios error details:", {
      status: axiosError.response?.status,
      data: responseData,
      message: axiosError.message,
    });

    // Handle specific error cases
    if (
      axiosError.response?.status === 401 ||
      axiosError.response?.status === 302
    ) {
      return {
        error: "Authentication required. Please login again.",
        status: 401,
      };
    }

    if (axiosError.response?.status === 404) {
      return {
        error: "Resource not found.",
        status: 404,
      };
    }

    // Handle HTML responses
    if (
      typeof axiosError.response?.data === "string" &&
      axiosError.response.data.includes("<!DOCTYPE html>")
    ) {
      return {
        error: responseData?.error || "An unexpected error occurred",
        status: 401,
      };
    }

    return {
      error: "An unexpected error occurred",
      status: axiosError.response?.status || 500,
    };
  }

  return {
    error:
      error instanceof Error ? error.message : "An unexpected error occurred",
    status: 500,
  };
};
