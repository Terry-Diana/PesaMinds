export interface Expense {
  id: string;
  category: string;
  amount: number;
  customCategory?: string;
  budgetId: string;
  budgets: number;
}

export type BudgetData = {
  id: string;
  user_id: string;
  created_at: string;
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


export type Video = {
  thumbnail: string;
  title: string;
  videoId: string;
};

export type Article = {
  id: number;
  title: string;
  summary: string;
  link: string;
  image: string; 
};