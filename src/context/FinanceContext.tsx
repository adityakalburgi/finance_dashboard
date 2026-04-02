import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { Transaction, Role, Filters, Category } from "@/data/types";
import { mockTransactions } from "@/data/mockData";

interface FinanceContextType {
  transactions: Transaction[];
  role: Role;
  setRole: (role: Role) => void;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  filteredTransactions: Transaction[];
  addTransaction: (txn: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const FinanceContext = createContext<FinanceContextType | null>(null);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const STORAGE_KEY = "financeTransactions";

  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setTransactions(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load transactions from localStorage:", error);
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error("Failed to save transactions to localStorage:", error);
    }
  }, [transactions]);
  const [role, setRole] = useState<Role>("admin");
  const [darkMode, setDarkMode] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    type: "all",
    category: "all",
    sortBy: "date",
    sortOrder: "desc",
  });

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }, []);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q),
      );
    }
    if (filters.type !== "all") {
      result = result.filter((t) => t.type === filters.type);
    }
    if (filters.category !== "all") {
      result = result.filter((t) => t.category === filters.category);
    }

    result.sort((a, b) => {
      const mul = filters.sortOrder === "asc" ? 1 : -1;
      if (filters.sortBy === "date") return mul * a.date.localeCompare(b.date);
      return mul * (a.amount - b.amount);
    });

    return result;
  }, [transactions, filters]);

  const addTransaction = useCallback((txn: Omit<Transaction, "id">) => {
    setTransactions((prev) => [{ ...txn, id: `txn-${Date.now()}` }, ...prev]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const { totalIncome, totalExpenses } = useMemo(() => {
    let inc = 0,
      exp = 0;
    transactions.forEach((t) => {
      if (t.type === "income") inc += t.amount;
      else exp += t.amount;
    });
    return { totalIncome: inc, totalExpenses: exp };
  }, [transactions]);

  const totalBalance = totalIncome - totalExpenses;

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        role,
        setRole,
        filters,
        setFilters,
        filteredTransactions,
        addTransaction,
        deleteTransaction,
        totalBalance,
        totalIncome,
        totalExpenses,
        darkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used within FinanceProvider");
  return ctx;
}
