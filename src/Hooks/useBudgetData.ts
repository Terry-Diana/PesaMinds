import { useState, useEffect } from 'react';
import { supabase } from '../Services/supabaseClient';
import { BudgetData} from '../Types/types';

// Define the type for the hook return value
export interface UseBudgetData {
  budgetData: BudgetData | null;        // Current budget data
  saveBudgetData: (data: BudgetData) => void; // Function to save budget data
}

export const useBudgetData = (userId: string): UseBudgetData => {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);

  // Fetch budget data when the hook is first used or when the userId changes
  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const { data, error } = await supabase
          .from('budgets')
          .select('*')
          .eq('user_id', userId)
          .single(); 

        if (error) {
          throw error;
        }

        // Transform the fetched data into the correct format
        if (data) {
          setBudgetData({
            income: data.income,
            expenses: data.expenses || [],
            categories: data.categories || [],
            savings: data.savings || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching budget data:', error);
      }
    };

    if (userId) {
      fetchBudgetData();
    }
  }, [userId]);

  // Save budget data to Supabase
  const saveBudgetData = async (data: BudgetData) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .upsert({
          user_id: userId,
          income: data.income,
          expenses: data.expenses,
          categories: data.categories,
          savings: data.savings,
        });

      if (error) {
        throw error;
      }

      // Update state with the new data
      setBudgetData(data);
    } catch (error) {
      console.error('Error saving budget data:', error);
    }
  };

  return {
    budgetData,
    saveBudgetData,
  };
};
