import React, { useState } from "react";
import { gsap } from "gsap";
import { Expense, BudgetData } from "../../Types/types";
import { insertExpense, deleteExpense } from "../../Services/expenseService";
import { useSupabaseAuth } from "../../Hooks/useSupabaseAuth";
import "./Expenses.css";

interface ExpensesProps {
  expenses: Expense[];
  categories: string[];
  budgetId: string; // Add this prop to pass the budget ID
  updateBudgetData: (newData: Partial<BudgetData>) => void;
}

const Expenses: React.FC<ExpensesProps> = ({
   expenses = [], // Default to an empty array
  categories = [], // Default to an empty array
  budgetId,
  updateBudgetData,
}) => {
  const [newExpense, setNewExpense] = useState<Expense>({
    id: "",
    category: "",
    amount: 0,
    budgetId: "",
  });
  const [customCategory, setCustomCategory] = useState<string>("");
  const [showCustomCategoryInput, setShowCustomCategoryInput] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { user } = useSupabaseAuth(); // Use your custom hook to get the user

  const essentialCategories = [
    "Select Category",
    "Food",
    "Transport",
    "Utilities",
    "Rent",
    "Entertainment",
    "Healthcare",
    "Education",
  ];

  const addExpense = async () => {
  if (!user || !budgetId || newExpense.amount <= 0 || newExpense.category === "Select Category" || !newExpense.category) {
    setErrorMessage("Please provide both amount and a valid category.");
    gsap.fromTo(
      ".error-message",
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.5,
        onComplete: () => {
          gsap.to(".error-message", { opacity: 0, duration: 0.5, delay: 2 });
        },
      }
    );
    return;
  }

  const categoryToUse =
    newExpense.category === "Other" ? customCategory : newExpense.category;

  // If editingIndex is not null, update the existing expense
  if (editingIndex !== null && newExpense.id) {
    const updatedExpense = { ...newExpense, category: categoryToUse };
    await insertExpense(user.id, budgetId, updatedExpense); // Update the existing expense in the database

    const updatedExpenses = expenses.map((exp, index) =>
      index === editingIndex ? updatedExpense : exp
    );

    updateBudgetData({ expenses: updatedExpenses });
  } else {
    // If editingIndex is null, insert a new expense
    const expenseToSave = { ...newExpense, category: categoryToUse };

    const { data, error } = await insertExpense(user.id, budgetId, expenseToSave); // Insert new expense to the database
    if (data) {
      const updatedExpenses = [...expenses, { ...expenseToSave, id: data.id }];
      updateBudgetData({ expenses: updatedExpenses });
    } else {
      console.error('Error inserting new expense:', error?.message);
    }
  }

  gsap.fromTo(".expense-item", { opacity: 0 }, { opacity: 1, duration: 0.5 });
  setNewExpense({ id: "", category: "", amount: 0, budgetId: "" });
  setCustomCategory("");
  setShowCustomCategoryInput(false);
  setErrorMessage(null);
  setEditingIndex(null);
};


  const handleEditExpense = (index: number) => {
    setNewExpense(expenses[index]);
    setEditingIndex(index);
    if (expenses[index].category === "Other") {
      setCustomCategory(expenses[index].customCategory || "");
      setShowCustomCategoryInput(true);
    } else {
      setCustomCategory("");
      setShowCustomCategoryInput(false);
    }
  };

  const handleDeleteExpense = async (index: number) => {
    const expenseToDelete = expenses[index];
    await deleteExpense(expenseToDelete.id);
    updateBudgetData({ expenses: expenses.filter((_, i) => i !== index) });
  };

  const clearExpenses = () => {
    updateBudgetData({ expenses: [] });
  };

  return (
    <div className="expenses-container">
      <h3>Expenses</h3>
      <input
        type="number"
        placeholder="Enter your expense"
        value={newExpense.amount || ""}
        onChange={(e) =>
          setNewExpense({ ...newExpense, amount: Number(e.target.value) })
        }
      />
      <select
        value={newExpense.category}
        onChange={(e) => {
          setNewExpense({ ...newExpense, category: e.target.value });
          if (e.target.value === "Other") {
            setShowCustomCategoryInput(true);
          } else {
            setShowCustomCategoryInput(false);
            setCustomCategory("");
          }
        }}
      >
        {essentialCategories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
        <option value="Other">Other</option>
      </select>
      {showCustomCategoryInput && (
        <input
          type="text"
          placeholder="Enter custom category"
          value={customCategory}
          onChange={(e) => setCustomCategory(e.target.value)}
        />
      )}
      <button onClick={addExpense}>
        {editingIndex !== null ? "Update Expense" : "Add Expense"}
      </button>
      <button onClick={clearExpenses}>Clear All Expenses</button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <ul>
        {expenses.map((expense, index) => (
          <li key={index} className="expense-item">
            {expense.category}: ${expense.amount}
            <button onClick={() => handleEditExpense(index)}>Edit</button>
            <button onClick={() => handleDeleteExpense(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Expenses;
