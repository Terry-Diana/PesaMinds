import React, { useState, useEffect } from 'react';
import { supabase } from './Services/supabaseClient';
import Income from './Components/Income/Income';
import Expenses from './Components/Expenses/Expenses';
import BudgetOverview from './Components/BudgetOverview/BudgetOverview';
import { useNavigate } from 'react-router-dom';
import { Expense, BudgetData } from './Types/types';
import Header from './Components/Header/Header';
import Sidebar from './Components/Sidebar/Sidebar';

const App: React.FC = () => {
  const [budgetData, setBudgetData] = useState<BudgetData>({
    id: '', // Initialize as an empty string
    user_id: '', // Initialize as an empty string
    created_at: '', // Initialize as an empty string
    income: 0,
    expenses: [],
    categories: [],
    savings: 0,
    totalExpenses: 0,
    remainingBalance: 0,
  });

  const [budgets, setBudgets] = useState<BudgetData[]>([]);  // Add this to hold multiple budgets

  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) {
        navigate('/login');
        return;
      }
    };

    const fetchBudgetData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (user) {
        const { data, error } = await supabase
          .from('budgets')
          .select('*')
          .eq('user_id', user.id);
        
        if (data) {
          setBudgets(data);  // Store all budgets
          const currentBudget = data.find((budget: BudgetData) => {
            const budgetDate = new Date(budget.created_at);
            const now = new Date();
            return (
              budgetDate.getMonth() === now.getMonth() &&
              budgetDate.getFullYear() === now.getFullYear()
            );
          });

          if (currentBudget) {
            setBudgetData(currentBudget);  // Set the current budget data
          } else {
            console.warn("No current budget found.");
          }
        } else if (error) {
          console.error('Error fetching budget data:', error.message);
        }
      }
    };

    checkUser();
    fetchBudgetData();
  }, [navigate]);

  const updateBudgetData = async (newData: Partial<BudgetData>) => {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (user) {
      const updatedData = { ...budgetData, ...newData };
      setBudgetData(updatedData);

      if (!budgetData.id) {
        // Create a new row
        const { data, error } = await supabase
          .from('budgets')
          .insert({ ...updatedData, user_id: user.id })
          .select()
          .single();
        
        if (data) {
          setBudgetData({ ...updatedData, id: data.id });
          setBudgets((prevBudgets) => [...prevBudgets, data]); // Add new budget to list
        }

        if (error) {
          console.error('Error inserting budget data:', error.message);
        }
      } else {
        // Update existing row
        const { error } = await supabase
          .from('budgets')
          .update({ ...updatedData, user_id: user.id })
          .eq('id', budgetData.id);  // Ensure we're updating the correct row

        if (error) {
          console.error('Error updating budget data:', error.message);
        }
      }
    }
  };

  return (
    <div className="App">
      <Header/>
      <Sidebar/>
      <div className='main-content'>
        <Income income={budgetData.income} updateBudgetData={updateBudgetData} />
        <Expenses expenses={budgetData.expenses} categories={budgetData.categories} budgetId={budgetData.id}  budgets={budgets} updateBudgetData={updateBudgetData}  />
        <BudgetOverview budgetData={budgetData} />
      </div>
    </div>
  );
};


export default App;
