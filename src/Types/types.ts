export interface Expense {
  id: string;
  category: string;
  amount: number;
  customCategory?: string;
  budgetId: string;
  budgets: number;
}

export type BudgetData = {
  id: string; // Budget ID
  user_id: string; // User ID
  created_at: string; // Date when the budget was created
  income: number;
  expenses: Expense[];
  categories: string[];
  savings: number;
  totalExpenses: number;
  remainingBalance: number;
};

export interface IncomeData {
  created_at: string;
  income: number;
}

export interface ExpenseData {
  created_at: string;
  amount: number;
}
