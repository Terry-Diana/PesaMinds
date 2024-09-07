import React, { useState, useEffect } from "react";
import Income from "../../Components/Income/Income";
import Expenses from "../../Components/Expenses/Expenses";
import BudgetOverview from "../../Components/BudgetOverview/BudgetOverview";
import { supabase } from "../../Services/supabaseClient";
import { BudgetData } from "../../Types/types";

const Home: React.FC = () => {
  const [budgetData, setBudgetData] = useState<BudgetData>({
    id: "",
    user_id: "",
    created_at: "",
    income: 0,
    expenses: [],
    categories: [],
    savings: 0,
    totalExpenses: 0,
    remainingBalance: 0,
  });

  useEffect(() => {
    const fetchBudgetData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;

      if (user) {
        const { data, error } = await supabase
          .from("budgets")
          .select("*")
          .eq("user_id", user.id);

        if (data && data.length > 0) {
          const currentBudget = data.find((budget: BudgetData) => {
            const budgetDate = new Date(budget.created_at);
            const now = new Date();
            return (
              budgetDate.getMonth() === now.getMonth() &&
              budgetDate.getFullYear() === now.getFullYear()
            );
          });

          if (currentBudget) {
            setBudgetData(currentBudget);
          }
        } else if (error) {
          console.error("Error fetching budget data:", error.message);
        }
      }
    };

    fetchBudgetData();
  }, []);

  const updateBudgetData = async (newData: Partial<BudgetData>) => {
    const updatedData = { ...budgetData, ...newData };
    setBudgetData(updatedData);
  };

  return (
    <div className="home-page">
      <Income income={budgetData.income} updateBudgetData={updateBudgetData} />
      <Expenses
        expenses={budgetData.expenses}
        categories={budgetData.categories}
        budgetId={budgetData.id}
        budgets={[budgetData]}
        updateBudgetData={updateBudgetData}
      />
      <BudgetOverview budgetData={budgetData} />
    </div>
  );
};

export default Home;
