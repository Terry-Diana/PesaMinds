import React, { useState } from 'react';
import './Income.css';

interface IncomeProps {
  initialIncome: number;
  onIncomeChange: (income: number) => void;
}

const Income: React.FC<IncomeProps> = ({ initialIncome, onIncomeChange }) => {
  const [income, setIncome] = useState(initialIncome);

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIncome = parseFloat(e.target.value);
    setIncome(newIncome);
    onIncomeChange(newIncome);
  };

  return (
    <div className="income-container">
      <h2>Income</h2>
      <input
        type="number"
        value={income}
        onChange={handleIncomeChange}
      />
    </div>
  );
};

export default Income;
