import React, { useEffect, useRef } from "react";
import { BudgetData } from "../../Types/types";
import { Chart, registerables } from "chart.js";
import "./BudgetOverview.css";

Chart.register(...registerables);
interface BudgetOverviewProps {
  budgetData: BudgetData;
}

const BudgetOverview: React.FC<BudgetOverviewProps> = ({ budgetData }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart<"pie", number[], string> | null>(null);

  const categoryColors: Record<string, string> = {
    Food: "#2ecc71",
    Transport: "#e74c3c",
    Utilities: "#3498db",
    Rent: "#f39c12",
    Entertainment: "#9b59b6",
    Healthcare: "#1abc9c",
    Education: "#e67e22",
    Other: "#95a5a6",
    "Remaining Balance": "#7f8c8d",
  };

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const totalExpenses = budgetData.expenses.reduce(
        (acc, curr) => acc + curr.amount,
        0
      );
      const remainingBalance = budgetData.income - totalExpenses;

      chartInstance.current = new Chart(chartRef.current, {
        type: "pie",
        data: {
          labels: [
            ...new Set(budgetData.expenses.map((exp) => exp.category)),
            "Remaining Balance",
          ],
          datasets: [
            {
              data: [
                ...budgetData.expenses.map((exp) => exp.amount),
                remainingBalance,
              ],
              backgroundColor: [
                ...budgetData.expenses.map(
                  (exp) =>
                    categoryColors[exp.category] || categoryColors["Other"]
                ),
                categoryColors["Remaining Balance"],
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top" as const,
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.dataset.label || "";
                  return `${label}: $${context.raw}`;
                },
              },
            },
          },
        },
      });
    }
  }, [budgetData]);

  return (
    <div className="budget-overview-container">
      <h3>Budget Overview</h3>
      <canvas ref={chartRef}></canvas>
      <p>Total Income: ${budgetData.income}</p>
      <p>
        Total Expenses: $
        {budgetData.expenses.reduce((acc, curr) => acc + curr.amount, 0)}
      </p>
      <p>
        Remaining Balance: $
        {budgetData.income -
          budgetData.expenses.reduce((acc, curr) => acc + curr.amount, 0)}
      </p>
    </div>
  );
};

export default BudgetOverview;
