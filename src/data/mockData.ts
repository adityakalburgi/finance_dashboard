import { Transaction, Category } from "./types";

const categories: Category[] = [
  "Salary", "Freelance", "Investments", "Food & Dining", "Transportation",
  "Shopping", "Entertainment", "Bills & Utilities", "Healthcare", "Travel", "Education", "Other"
];

const incomeCategories: Category[] = ["Salary", "Freelance", "Investments"];
const expenseCategories: Category[] = categories.filter(c => !incomeCategories.includes(c));

const descriptions: Record<string, string[]> = {
  "Salary": ["Monthly Salary", "Bonus Payment", "Overtime Pay"],
  "Freelance": ["Web Design Project", "Consulting Fee", "Content Writing"],
  "Investments": ["Stock Dividends", "Crypto Gains", "Rental Income"],
  "Food & Dining": ["Grocery Store", "Restaurant Dinner", "Coffee Shop", "Lunch Meeting"],
  "Transportation": ["Gas Station", "Uber Ride", "Metro Pass", "Car Maintenance"],
  "Shopping": ["Amazon Purchase", "Clothing Store", "Electronics", "Home Decor"],
  "Entertainment": ["Netflix Subscription", "Concert Tickets", "Gaming", "Books"],
  "Bills & Utilities": ["Electricity Bill", "Internet Service", "Water Bill", "Phone Plan"],
  "Healthcare": ["Pharmacy", "Doctor Visit", "Gym Membership", "Dental Checkup"],
  "Travel": ["Flight Booking", "Hotel Stay", "Travel Insurance"],
  "Education": ["Online Course", "Workshop Fee", "Study Materials"],
  "Other": ["Gift Purchase", "Donation", "Miscellaneous"],
};

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateTransactions(): Transaction[] {
  const txns: Transaction[] = [];
  const now = new Date(2025, 5, 15);

  for (let i = 0; i < 80; i++) {
    const daysAgo = Math.floor(Math.random() * 365);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);

    const isIncome = Math.random() < 0.3;
    const type = isIncome ? "income" : "expense";
    const category = isIncome ? randomFrom(incomeCategories) : randomFrom(expenseCategories);
    const desc = randomFrom(descriptions[category]);

    const amount = isIncome
      ? Math.round((Math.random() * 4000 + 1000) * 100) / 100
      : Math.round((Math.random() * 300 + 10) * 100) / 100;

    txns.push({
      id: `txn-${String(i).padStart(3, "0")}`,
      date: date.toISOString().split("T")[0],
      description: desc,
      amount,
      category,
      type,
    });
  }

  return txns.sort((a, b) => b.date.localeCompare(a.date));
}

export const mockTransactions: Transaction[] = generateTransactions();
