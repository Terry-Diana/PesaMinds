import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './BudgetOverview.css';

ChartJS.register(ArcElement, Tooltip, Legend);

interface BudgetOverviewProps {
  income: number;
  expenses: number;
}

const BudgetOverview: React.FC<BudgetOverviewProps> = ({ income, expenses }) => {
  const data = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        data: [income, expenses],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  return (
    <div className="budget-overview">
      <h2>Budget Overview</h2>
      <Pie data={data} />
    </div>
  );
};

export default BudgetOverview;
