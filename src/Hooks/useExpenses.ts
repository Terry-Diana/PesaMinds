import { useState } from 'react';
import { Expense } from '../Types/types';
import { useBudgetData } from './useBudgetData';

export const useExpenses = (userId: string) => {
  const { budgetData, saveBudgetData } = useBudgetData(userId);

  const [expenses, setExpenses] = useState<Expense[]>(budgetData?.expenses || []);
  const [categories, setCategories] = useState<string[]>(budgetData?.categories || ['Bills', 'Car']);

  const addExpense = (expense: Expense) => {
    const updatedExpenses = [...expenses, expense];
    setExpenses(updatedExpenses);
    saveBudgetData({ income: budgetData?.income || 0, expenses: updatedExpenses, categories, savings: budgetData?.savings || 0 });
  };

  const addCategory = (category: string) => {
    const updatedCategories = [...categories, category];
    setCategories(updatedCategories);
    saveBudgetData({ income: budgetData?.income || 0, expenses, categories: updatedCategories, savings: budgetData?.savings || 0, });
  };

  return { expenses, categories, addExpense, addCategory };
};
