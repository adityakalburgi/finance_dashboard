import { useFinance } from "@/context/FinanceContext";
import { Moon, Sun, Shield, Eye } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Role } from "@/data/types";

export function DashboardHeader() {
  const { role, setRole, darkMode, toggleDarkMode } = useFinance();

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Finance Dashboard
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track your income, expenses, and spending patterns
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <Select value={role} onValueChange={(v) => setRole(v as Role)}>
          <SelectTrigger className="w-[140px] bg-card border-border">
            <div className="flex items-center gap-2">
              {role === "admin" ? <Shield size={14} /> : <Eye size={14} />}
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">
              <span className="flex items-center gap-2"><Shield size={14} /> Admin</span>
            </SelectItem>
            <SelectItem value="viewer">
              <span className="flex items-center gap-2"><Eye size={14} /> Viewer</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
