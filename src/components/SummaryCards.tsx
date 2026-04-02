import { useFinance } from "@/context/FinanceContext";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { motion } from "framer-motion";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const cards = [
  { key: "balance", label: "Total Balance", icon: Wallet, color: "primary" },
  { key: "income", label: "Total Income", icon: TrendingUp, color: "income" },
  { key: "expenses", label: "Total Expenses", icon: TrendingDown, color: "expense" },
] as const;

export function SummaryCards() {
  const { totalBalance, totalIncome, totalExpenses } = useFinance();

  const values = {
    balance: totalBalance,
    income: totalIncome,
    expenses: totalExpenses,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const value = values[card.key];
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="rounded-xl bg-card border border-border p-5 card-shadow hover:card-shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
              <div className={`p-2 rounded-lg ${
                card.color === "income" ? "bg-income-muted text-income" :
                card.color === "expense" ? "bg-expense-muted text-expense" :
                "bg-primary/10 text-primary"
              }`}>
                <Icon size={18} />
              </div>
            </div>
            <p className={`text-2xl font-bold font-mono tracking-tight ${
              card.color === "income" ? "text-income" :
              card.color === "expense" ? "text-expense" :
              "text-foreground"
            }`}>
              {formatCurrency(value)}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
