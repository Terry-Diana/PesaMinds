import { supabase } from './supabaseClient';
import { BudgetData } from '../Types/types';

export const insertOrUpdateBudget = async (userId: string, budgetData: BudgetData) => {
  try {
    // Try to fetch the existing budget for the user
    const { data: existingBudget, error: fetchError } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .single(); // This will return only one result or throw an error if none or multiple are found

    if (fetchError && fetchError.code === 'PGRST116') {
      // If no rows are found (code 'PGRST116' means no rows returned by 'single')
      // Insert a new budget row
      const { error: insertError } = await supabase
        .from('budgets')
        .insert({
          user_id: userId,
          income: budgetData.income,
          total_expenses: budgetData.totalExpenses,
          remaining_balance: budgetData.remainingBalance,
        });

      if (insertError) {
        throw new Error(`Failed to insert budget: ${insertError.message}`);
      }
    } else if (fetchError) {
      // Handle other possible fetch errors
      throw new Error(`Failed to fetch existing budget: ${fetchError.message}`);
    } else {
      // If a budget row is found, update it
      const { error: updateError } = await supabase
        .from('budgets')
        .update({
          income: budgetData.income,
          total_expenses: budgetData.totalExpenses,
          remaining_balance: budgetData.remainingBalance,
        })
        .eq('user_id', userId);

      if (updateError) {
        throw new Error(`Failed to update budget: ${updateError.message}`);
      }
    }
  } catch (error) {
    console.error('Error inserting Income:', error);
    throw error;
  }
};
