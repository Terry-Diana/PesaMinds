import { supabase } from './supabaseClient';
import { Expense } from '../Types/types';

export const insertExpense = async (
    userId: string,
    budgetId: string,
    expense: Expense
  ) => {
    const { id, category, amount } = expense;
  
    if (id) {
      // Update existing expense
      const { data, error } = await supabase
        .from("expenses")
        .update({ category, amount })
        .eq("id", id)
        .eq("user_id", userId)
        .eq("budget_id", budgetId);
  
      return { data, error };
    } else {
      // Insert new expense
      const { data, error } = await supabase
        .from("expenses")
        .insert([{ user_id: userId, budget_id: budgetId, category, amount }])
        .select("id")
        .single();
  
      return { data, error };
    }
  };
  

export const fetchExpenses = async (userId: string, budgetId: string) => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .eq('budget_id', budgetId);

    if (error) {
      console.error('Error fetching expenses:', error.message);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error:', (error as Error).message);
    throw error;
  }
};

export const deleteExpense = async (expenseId: string) => {
  try {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId);

    if (error) {
      console.error('Error deleting expense:', error.message);
      throw error;
    }
  } catch (error) {
    console.error('Unexpected error:', (error as Error).message);
    throw error;
  }
};
