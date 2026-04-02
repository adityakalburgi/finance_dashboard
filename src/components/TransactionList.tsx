import { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { Search, ArrowUpDown, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Category, TransactionType } from "@/data/types";
import { motion, AnimatePresence } from "framer-motion";
import { ExportButton } from "@/components/ExportButton";

const allCategories: Category[] = [
  "Salary", "Freelance", "Investments", "Food & Dining", "Transportation",
  "Shopping", "Entertainment", "Bills & Utilities", "Healthcare", "Travel", "Education", "Other"
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function AddTransactionDialog({ onAdd }: { onAdd: (t: { date: string; description: string; amount: number; category: Category; type: TransactionType }) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: "",
    category: "Other" as Category,
    type: "expense" as TransactionType,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;
    onAdd({
      ...form,
      amount: parseFloat(form.amount),
    });
    setForm({ date: new Date().toISOString().split("T")[0], description: "", amount: "", category: "Other", type: "expense" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus size={15} /> Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest("[data-radix-select-content]") || target.closest("[role='listbox']") || target.closest("[role='option']")) {
          e.preventDefault();
        }
      }}>
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>Fill in the details below to add a new transaction.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Date</label>
              <Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm(p => ({ ...p, type: e.target.value as TransactionType }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
            <Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="e.g. Grocery Store" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Amount ($)</label>
              <Input type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="0.00" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm(p => ({ ...p, category: e.target.value as Category }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <Button type="submit" className="w-full">Add Transaction</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function TransactionList() {
  const { filteredTransactions, filters, setFilters, role, addTransaction, deleteTransaction } = useFinance();

  const toggleSort = (field: "date" | "amount") => {
    setFilters(p => ({
      ...p,
      sortBy: field,
      sortOrder: p.sortBy === field && p.sortOrder === "desc" ? "asc" : "desc",
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="rounded-xl bg-card border border-border card-shadow"
    >
      <div className="p-5 border-b border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-semibold text-foreground">Transactions</h3>
          <div className="flex items-center gap-2">
            <ExportButton />
            {role === "admin" && (
              <AddTransactionDialog onAdd={addTransaction} />
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-9 bg-secondary/50 border-border"
              value={filters.search}
              onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
            />
          </div>
          <Select value={filters.type} onValueChange={(v) => setFilters(p => ({ ...p, type: v as any }))}>
            <SelectTrigger className="w-[130px] bg-secondary/50"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.category} onValueChange={(v) => setFilters(p => ({ ...p, category: v as any }))}>
            <SelectTrigger className="w-[160px] bg-secondary/50"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table header */}
      <div className="hidden sm:grid grid-cols-[1fr_1fr_120px_100px_40px] gap-2 px-5 py-2.5 text-xs font-medium text-muted-foreground border-b border-border">
        <button onClick={() => toggleSort("date")} className="flex items-center gap-1 hover:text-foreground transition-colors">
          Date {filters.sortBy === "date" && (filters.sortOrder === "desc" ? <ArrowDown size={12} /> : <ArrowUp size={12} />)}
        </button>
        <span>Description</span>
        <span>Category</span>
        <button onClick={() => toggleSort("amount")} className="flex items-center gap-1 justify-end hover:text-foreground transition-colors">
          Amount {filters.sortBy === "amount" && (filters.sortOrder === "desc" ? <ArrowDown size={12} /> : <ArrowUp size={12} />)}
        </button>
        <span />
      </div>

      {/* Rows */}
      <div className="max-h-[400px] overflow-y-auto">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No transactions found
          </div>
        ) : (
          <AnimatePresence>
            {filteredTransactions.map((txn, i) => (
              <motion.div
                key={txn.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.5) }}
                className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_120px_100px_40px] gap-1 sm:gap-2 px-5 py-3 border-b border-border/50 hover:bg-secondary/30 transition-colors items-center"
              >
                <span className="text-xs text-muted-foreground sm:text-sm">{formatDate(txn.date)}</span>
                <span className="text-sm font-medium text-foreground">{txn.description}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground w-fit">
                  {txn.category}
                </span>
                <span className={`text-sm font-mono font-medium text-right ${
                  txn.type === "income" ? "text-income" : "text-expense"
                }`}>
                  {txn.type === "income" ? "+" : "-"}${txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <div className="flex justify-end">
                  {role === "admin" && (
                    <button
                      onClick={() => deleteTransaction(txn.id)}
                      className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
