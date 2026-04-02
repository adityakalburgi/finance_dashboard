import { useFinance } from "@/context/FinanceContext";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ExportButton() {
  const { filteredTransactions } = useFinance();

  const exportCSV = () => {
    const headers = ["Date", "Description", "Category", "Type", "Amount"];
    const rows = filteredTransactions.map(t => [
      t.date,
      `"${t.description}"`,
      t.category,
      t.type,
      t.type === "income" ? t.amount.toFixed(2) : `-${t.amount.toFixed(2)}`,
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    downloadFile(csv, "transactions.csv", "text/csv");
  };

  const exportJSON = () => {
    const data = filteredTransactions.map(t => ({
      date: t.date,
      description: t.description,
      category: t.category,
      type: t.type,
      amount: t.type === "income" ? t.amount : -t.amount,
    }));
    downloadFile(JSON.stringify(data, null, 2), "transactions.json", "application/json");
  };

  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Download size={15} /> Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportCSV}>Export as CSV</DropdownMenuItem>
        <DropdownMenuItem onClick={exportJSON}>Export as JSON</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
