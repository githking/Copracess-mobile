// services/transaction/api.ts
import { TransactionFilters } from "./types";
import { authService } from "../auth/service";

class TransactionService {
  async fetchTransactions(filters?: TransactionFilters) {
    try {
      const api = authService.getApi();

      console.log("Fetching transactions with filters:", filters);
      const response = await api.get("/api/mobile/transactions", {
        params: {
          ...filters,
          startDate: filters?.startDate?.toISOString(),
          endDate: filters?.endDate?.toISOString(),
        },
      });

      return response.data.transactions || [];
    } catch (error) {
      if (error instanceof Error && error.message === "AUTH_EXPIRED") {
        throw error;
      }
      console.error("Transaction fetch error:", error);
      throw new Error("Failed to fetch transactions");
    }
  }
}

export const transactionService = new TransactionService();
