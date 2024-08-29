// Define the structure for an Expense
export interface Expense {
    id: string;          // Unique identifier for the expense
    amount: number;      // The amount of the expense
    category: string;    // Category of the expense (e.g., Bills, Car)
    description?: string; // Optional description for the expense
  }
  
  // Define the structure for Budget Data
  export interface BudgetData {
    income: number;                   // Total income
    expenses: Expense[];              // Array of expenses
    categories: string[];             // Array of expense categories
    savings: number;
  }
  
  // Define the structure for a category
  export interface Category {
    id: string;      // Unique identifier for the category
    name: string;    // Name of the category (e.g., Bills, Car)
  }
  
  // Define types for Income and Expenses Hooks
  export interface UseIncome {
    income: number;                 // Current income value
    updateIncome: (newIncome: number) => void; // Function to update income
  }
  
  export interface UseExpenses {
    expenses: Expense[];            // Array of expenses
    categories: string[];           // Array of expense categories
    addExpense: (expense: Expense) => void;  // Function to add a new expense
    addCategory: (category: string) => void; // Function to add a new category
  }
  