// hooks/useTransactions.ts
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import type { OilmillTransaction, CopraOwnerTransaction } from "@/types/type";
import { TransactionFilters } from "./types";
import { transactionService } from "./api";

export const useTransactions = (initialFilters?: TransactionFilters) => {
  const router = useRouter();
  const { onLogout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<
    Array<OilmillTransaction | CopraOwnerTransaction>
  >([]);
  const [filters, setFilters] = useState(initialFilters);

  const loadTransactions = useCallback(async () => {
    try {
      setError(null);
      const data = await transactionService.fetchTransactions(filters);
      setTransactions(data);
    } catch (err) {
      console.error("Load error:", err);
      if (err instanceof Error && err.message === "AUTH_EXPIRED") {
        await onLogout?.();
        router.replace("/signIn");
        return;
      }
      setError(
        err instanceof Error ? err.message : "Failed to load transactions"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters, onLogout, router]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return {
    transactions,
    loading,
    refreshing,
    error,
    refresh: useCallback(() => {
      setRefreshing(true);
      loadTransactions();
    }, [loadTransactions]),
    updateFilters: useCallback((newFilters: TransactionFilters) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    }, []),
  };
};
