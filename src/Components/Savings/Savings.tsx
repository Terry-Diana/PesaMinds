import React from 'react';
import './Savings.css';

interface SavingsProps {
  savings: number;
}

const Savings: React.FC<SavingsProps> = ({ savings }) => {
  return (
    <div className="savings-container">
      <h2>Savings</h2>
      <p>{savings}</p>
    </div>
  );
};

export default Savings;
