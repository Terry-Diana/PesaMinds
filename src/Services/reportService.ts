import { supabase } from "./supabaseClient";

export const fetchMonthlyIncomeExpenses = async (userId: string) => {
  const { data, error } = await supabase.rpc("fetch_monthly_income_expenses", {
    user_id: userId,
  });

  if (error) {
    console.error("Error fetching monthly income and expenses:", error);
    return [];
  }

  return data;
};

export const fetchCategoryExpenses = async (
  userId: string,
  category: string
) => {
  try {
    const { data, error } = await supabase.rpc("fetch_category_expenses", {
      category,
      user_id: userId,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching category expenses:", error);
    return [];
  }
};
