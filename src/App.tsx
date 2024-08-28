import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useSupabaseAuth } from './Hooks/useSupabaseAuth';
import { useBudgetData } from './Hooks/useBudgetData';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Header/Header';
import Sidebar from './Components/Sidebar/Sidebar';
import Income from './Components/Income/Income';
import Expenses from './Components/Expenses/Expenses';
import Savings from './Components/Savings/Savings';
import BudgetOverview from './Components/BudgetOverview/BudgetOverview';
import SignUp from './Components/Auth/SignUp';
import Login from './Components/Auth/Login';
import Home from './Pages/Home/Home';
import Game from './Pages/Game/Game';
import { UserProvider } from './Context/UserContext';
import './App.css';

function App() {
  const { user } = useSupabaseAuth();
  const { budgetData, saveBudgetData } = useBudgetData(user?.id || '');
  const [income, setIncome] = useState(budgetData?.income || 0);
  const [expenses, setExpenses] = useState(budgetData?.expenses || 0);

  useEffect(() => {
    gsap.from('.app-container', { opacity: 0, duration: 1 });
  }, []);

  const handleIncomeChange = (newIncome: number) => {
    setIncome(newIncome);
    saveBudgetData({ income: newIncome, expenses });
  };

  const handleExpensesChange = (newExpenses: number) => {
    setExpenses(newExpenses);
    saveBudgetData({ income, expenses: newExpenses });
  };

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<SignUp />} />
        </Routes>
      </Router>
    );
  }

  return (
    <div className="App">
      <UserProvider>
        <Router>
          <Header />
          <Sidebar />
          <main className="main-content">
          <Income initialIncome={income} onIncomeChange={handleIncomeChange} />
            <Expenses initialExpenses={expenses} onExpensesChange={handleExpensesChange} />
            <BudgetOverview income={income} expenses={expenses} />
            <Savings savings={income - expenses} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/game" element={<Game />} />
            </Routes>
          </main>
        </Router>
      </UserProvider>
    </div>
  );
}

export default App;
