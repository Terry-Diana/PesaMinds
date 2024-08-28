import { useState, useEffect } from 'react';
import { supabase } from '../Services/supabaseClient';

export const useBudgetData = (userId: string) => {
  const [budgetData, setBudgetData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching data:', error.message);
      } else {
        setBudgetData(data);
      }
    };

    fetchData();
  }, [userId]);

  const saveBudgetData = async (data: any) => {
    const { error } = await supabase
      .from('budgets')
      .upsert({ ...data, user_id: userId });

    if (error) {
      console.error('Error saving data:', error.message);
    }
  };

  return { budgetData, saveBudgetData };
};
