import React, { useEffect, useState, useRef } from "react";
import { Chart, registerables } from "chart.js";
import {
  fetchMonthlyIncomeExpenses,
  fetchCategoryExpenses,
} from "../../Services/reportService";
import { supabase } from "../../Services/supabaseClient";
import "./Reports.css";

Chart.register(...registerables);

const Reports: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<
    { month: string; income: number; expenses: number }[]
  >([]);
  const [categoryData, setCategoryData] = useState<
    { month: string; total_category_expenses: number }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [user, setUser] = useState<{ id: string } | null>(null);

  const monthlyChartRef = useRef<Chart | null>(null);
  const categoryChartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchMonthlyIncomeExpenses(user.id).then((data) => {
        setMonthlyData(data);
        renderMonthlyChart(data);
      });
    }
  }, [user]);

  useEffect(() => {
    if (user && selectedCategory) {
      fetchCategoryExpenses(user.id, selectedCategory).then((data) => {
        setCategoryData(data);
        renderCategoryChart(data);
      });
    }
  }, [user, selectedCategory]);

  const renderMonthlyChart = (
    data: { month: string; income: number; expenses: number }[]
  ) => {
    const ctx = document.getElementById("monthlyChart") as HTMLCanvasElement;

    if (monthlyChartRef.current) {
      monthlyChartRef.current.destroy();
    }

    monthlyChartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map((d) => d.month),
        datasets: [
          {
            label: "Income",
            data: data.map((d) => d.income),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "Expenses",
            data: data.map((d) => d.expenses),
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  const renderCategoryChart = (
    data: { month: string; total_category_expenses: number }[]
  ) => {
    const ctx = document.getElementById("categoryChart") as HTMLCanvasElement;

    if (categoryChartRef.current) {
      categoryChartRef.current.destroy();
    }

    categoryChartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((d) => d.month),
        datasets: [
          {
            label: `Expenses for ${selectedCategory}`,
            data: data.map((d) => d.total_category_expenses),
            backgroundColor: "rgba(153, 102, 255, 0.2)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  return (
    <div className="reports-page">
      <h2>Financial Reports</h2>

      <div className="chart-container">
        <h3>Monthly Income vs. Expenses</h3>
        <canvas id="monthlyChart"></canvas>
      </div>

      <div className="chart-container">
        <h3>Category-based Expenses</h3>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select a Category</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Rent">Rent</option>
          <option value="Utilities">Utilities</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Education">Education</option>
          <option value="Education">Debt</option>
          <option value="Insurance">Insurance</option>
          <option value="Clothing">Clothing</option>
          <option value="Repairs">Repairs</option>
          <option value="Household">HouseholdSupplies</option>
          <option value="Retirement">Retirement</option>
          <option value="Gifts">GiftsDonations</option>
          <option value="Personal">Personal</option>
          <option value="Savings">Savings</option>
          {/* Add other categories as necessary */}
        </select>
        <canvas id="categoryChart"></canvas>
      </div>
    </div>
  );
};

export default Reports;
