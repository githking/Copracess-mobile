// types.ts
import type { InternalAxiosRequestConfig } from "axios";
import type { OilmillTransaction, CopraOwnerTransaction } from "@/types/type";

export interface TransactionResponse {
  transactions?: (OilmillTransaction | CopraOwnerTransaction)[];
  error?: string;
}

export interface TransactionError {
  error: string;
  status: number;
}

export interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  status?: string[];
  searchQuery?: string;
}

// Extend axios config type to include retry property
export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
