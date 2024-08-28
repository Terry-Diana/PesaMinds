import React, { useState } from 'react';
import './Expenses.css';

interface ExpensesProps {
  initialExpenses: number;
  onExpensesChange: (expenses: number) => void;
}

const Expenses: React.FC<ExpensesProps> = ({ initialExpenses, onExpensesChange }) => {
  const [expenses, setExpenses] = useState(initialExpenses);

  const handleExpensesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newExpenses = parseFloat(e.target.value);
    setExpenses(newExpenses);
    onExpensesChange(newExpenses);
  };

  return (
    <div className="expenses-container">
      <h2>Expenses</h2>
      <input
        type="number"
        value={expenses}
        onChange={handleExpensesChange}
      />
    </div>
  );
};

export default Expenses;
