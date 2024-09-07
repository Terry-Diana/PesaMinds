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
    Rent: "#800000",
    Entertainment: "#32012f",
    Healthcare: "#1abc9c",
    Education: "#e67e22",
    Debt: "#1230ae",
    Insurance: "#00712d",
    Clothing: "#f5004f",
    Repairs: "#c40c0c",
    HouseholdSupplies: "#D20062",
    Retirement: "#EF9C66",
    GiftsDonations: "#FA7070",
    Personal: "#910A67",
    Savings: "#3D3B40",
    Other: "#ac87C5",
    "Remaining Balance": "#7f8c8d",
  };

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const totalExpenses = (budgetData.expenses || []).reduce(
        (acc, curr) => acc + curr.amount,
        0
      );
      const remainingBalance = budgetData.income - totalExpenses;

      chartInstance.current = new Chart(chartRef.current, {
        type: "pie",
        data: {
          labels: [
            ...new Set((budgetData.expenses || []).map((exp) => exp.category)),
            "Remaining Balance",
          ],
          datasets: [
            {
              data: [
                ...(budgetData.expenses || []).map((exp) => exp.amount),
                remainingBalance,
              ],
              backgroundColor: [
                ...(budgetData.expenses || []).map(
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
                  const label = context.label || "";
                  const value = context.raw;
                  return `${label}: $${value}`;
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [budgetData]); 

  return (
    <div className="budget-overview-container">
      <h3>Budget Overview</h3>
      <canvas ref={chartRef}></canvas>
      <p>Total Income: ${budgetData.income}</p>
      <p>
        Total Expenses: $
        {(budgetData.expenses || []).reduce(
          (acc, curr) => acc + curr.amount,
          0
        )}
      </p>
      <p>
        Remaining Balance: $
        {budgetData.income -
          (budgetData.expenses || []).reduce(
            (acc, curr) => acc + curr.amount,
            0
          )}
      </p>
    </div>
  );
};

export default BudgetOverview;
