import { supabase } from "./supabaseClient";
import { BudgetData } from "../Types/types";

export const insertBudget = async (userId: string, budgetData: BudgetData) => {
  try {
    const { error } = await supabase.from("budgets").insert({
      user_id: userId,
      income: budgetData.income,
      total_expenses: budgetData.totalExpenses,
      remaining_balance: budgetData.remainingBalance,
      date: new Date(),
    });

    if (error) {
      throw new Error(`Failed to insert budget: ${error.message}`);
    }
  } catch (error) {
    console.error("Error inserting budget:", error);
    throw error;
  }
};
