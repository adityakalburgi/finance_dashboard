import { useMemo } from "react";
import { useFinance } from "@/context/FinanceContext";
import { TrendingUp, TrendingDown, BarChart3, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function InsightsSection() {
  const { transactions } = useFinance();

  const insights = useMemo(() => {
    // Highest spending category
    const catMap = new Map<string, number>();
    transactions
      .filter(t => t.type === "expense")
      .forEach(t => catMap.set(t.category, (catMap.get(t.category) || 0) + t.amount));
    
    const topCategory = Array.from(catMap.entries()).sort((a, b) => b[1] - a[1])[0];

    // Monthly comparison (last 2 months)
    const monthExpenses = new Map<string, number>();
    transactions
      .filter(t => t.type === "expense")
      .forEach(t => {
        const m = t.date.slice(0, 7);
        monthExpenses.set(m, (monthExpenses.get(m) || 0) + t.amount);
      });
    
    const sortedMonths = Array.from(monthExpenses.keys()).sort().reverse();
    const currentMonth = sortedMonths[0];
    const prevMonth = sortedMonths[1];
    const currentSpend = monthExpenses.get(currentMonth) || 0;
    const prevSpend = monthExpenses.get(prevMonth) || 0;
    const changePercent = prevSpend > 0 ? ((currentSpend - prevSpend) / prevSpend) * 100 : 0;

    // Average transaction
    const expenses = transactions.filter(t => t.type === "expense");
    const avgExpense = expenses.length > 0 ? expenses.reduce((s, t) => s + t.amount, 0) / expenses.length : 0;

    // Largest single transaction
    const largest = transactions.reduce((max, t) => t.amount > max.amount ? t : max, transactions[0]);

    return { topCategory, changePercent, avgExpense, largest, currentSpend };
  }, [transactions]);

  if (!insights.topCategory) return null;

  const cards = [
    {
      icon: BarChart3,
      label: "Top Spending Category",
      value: insights.topCategory[0],
      sub: `$${Math.round(insights.topCategory[1]).toLocaleString()} total`,
      color: "text-chart-3",
      bg: "bg-chart-3/10",
    },
    {
      icon: insights.changePercent <= 0 ? TrendingDown : TrendingUp,
      label: "Monthly Change",
      value: `${insights.changePercent >= 0 ? "+" : ""}${insights.changePercent.toFixed(1)}%`,
      sub: `$${Math.round(insights.currentSpend).toLocaleString()} this month`,
      color: insights.changePercent <= 0 ? "text-income" : "text-expense",
      bg: insights.changePercent <= 0 ? "bg-income/10" : "bg-expense/10",
    },
    {
      icon: Zap,
      label: "Avg. Expense",
      value: `$${Math.round(insights.avgExpense).toLocaleString()}`,
      sub: "per transaction",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: TrendingUp,
      label: "Largest Transaction",
      value: `$${insights.largest.amount.toLocaleString()}`,
      sub: insights.largest.description,
      color: "text-chart-4",
      bg: "bg-chart-4/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
            className="rounded-xl bg-card border border-border p-4 card-shadow"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-md ${card.bg}`}>
                <Icon size={14} className={card.color} />
              </div>
              <span className="text-xs text-muted-foreground">{card.label}</span>
            </div>
            <p className="text-lg font-bold text-foreground">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.sub}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
