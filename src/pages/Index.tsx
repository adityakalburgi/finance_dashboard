import { FinanceProvider } from "@/context/FinanceContext";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SummaryCards } from "@/components/SummaryCards";
import { BalanceTrendChart } from "@/components/BalanceTrendChart";
import { SpendingBreakdown } from "@/components/SpendingBreakdown";
import { TransactionList } from "@/components/TransactionList";
import { InsightsSection } from "@/components/InsightsSection";

const Index = () => {
  return (
    <FinanceProvider>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <DashboardHeader />
          <div className="space-y-6">
            <SummaryCards />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3">
                <BalanceTrendChart />
              </div>
              <div className="lg:col-span-2">
                <SpendingBreakdown />
              </div>
            </div>
            <InsightsSection />
            <TransactionList />
          </div>
        </div>
      </div>
    </FinanceProvider>
  );
};

export default Index;
