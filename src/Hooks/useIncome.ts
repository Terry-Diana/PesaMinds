import { useState } from 'react';
import { useBudgetData } from './useBudgetData';

export const useIncome = (userId: string) => {
  const { budgetData, saveBudgetData } = useBudgetData(userId);

  const [income, setIncome] = useState<number>(budgetData?.income || 0);

  const updateIncome = (newIncome: number) => {
    setIncome(newIncome);
    saveBudgetData({ income: newIncome, expenses: budgetData?.expenses || [], categories: budgetData?.categories || [] , savings: budgetData?.savings || 0});
  };

  return { income, updateIncome };
};
