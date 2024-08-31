export interface Expense {
  id: string;
  category: string;
  amount: number;
  customCategory?: string;
  budgetId: string;
}

export interface BudgetData {
  income: number;
  expenses: Expense[];
  categories: string[];
  savings: number;
  totalExpenses: number; 
  remainingBalance: number;
  budgetId: string;

}
