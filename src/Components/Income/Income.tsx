import React, { useState } from "react";
import { gsap } from "gsap";
import { BudgetData } from "../../Types/types";
import { insertBudget } from "../../Services/budgetService";
import { useSupabaseAuth } from "../../Hooks/useSupabaseAuth";
import "./Income.css";

interface IncomeProps {
  income: number;
  updateBudgetData: (newData: Partial<BudgetData>) => void;
}

const Income: React.FC<IncomeProps> = ({ income = 0, updateBudgetData }) => {
  const [newIncome, setNewIncome] = useState<number>(income);
  const { user } = useSupabaseAuth();

  const handleIncomeChange = async () => {
    if (!user || newIncome === undefined) return;

    const budgetData: BudgetData = {
      id: "",
      user_id: user.id,
      created_at: "",
      income: newIncome,
      expenses: [],
      categories: [],
      savings: 0,
      totalExpenses: 0,
      remainingBalance: 0,
    };

    await insertBudget(user.id, budgetData);

    updateBudgetData({ income: newIncome });
    gsap.fromTo(
      ".income-input",
      { scale: 1 },
      { scale: 1.1, duration: 0.3, yoyo: true, repeat: 1 }
    );
  };

  return (
    <div className="income-container">
      <h3>Income</h3>
      <input
        className="income-input"
        type="number"
        placeholder="Enter your income"
        value={newIncome || ""}
        onChange={(e) => setNewIncome(Number(e.target.value))}
      />
      <button onClick={handleIncomeChange}>Update Income</button>
    </div>
  );
};

export default Income;
