import React, { useEffect, useState, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { fetchMonthlyIncomeExpenses, fetchCategoryExpenses } from "../../Services/reportService";
import { supabase } from "../../Services/supabaseClient";

Chart.register(...registerables);

const Reports: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<{ month: string; income: number; expenses: number }[]>([]);
  const [categoryData, setCategoryData] = useState<{ month: string; total_category_expenses: number }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [user, setUser] = useState<{ id: string } | null>(null);
  
  // Refs to store chart instances
  const monthlyChartRef = useRef<Chart | null>(null);
  const categoryChartRef = useRef<Chart | null>(null);

  // Fetch authenticated user info
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user); // Ensure session.user is defined
      }
    };

    fetchUser();
  }, []);

  // Fetch monthly income and expenses when component mounts
  useEffect(() => {
    if (user) {
      fetchMonthlyIncomeExpenses(user.id).then((data) => {
        setMonthlyData(data);
        renderMonthlyChart(data); // Render the chart when data is fetched
      });
    }
  }, [user]);

  // Fetch category-based expenses when a category is selected
  useEffect(() => {
    if (user && selectedCategory) {
      fetchCategoryExpenses(user.id, selectedCategory).then((data) => {
        setCategoryData(data);
        renderCategoryChart(data); // Render the chart when data is fetched
      });
    }
  }, [user, selectedCategory]);

  // Function to render the monthly income vs. expenses chart
  const renderMonthlyChart = (data: { month: string; income: number; expenses: number }[]) => {
    const ctx = document.getElementById("monthlyChart") as HTMLCanvasElement;

    // Destroy existing chart if it exists
    if (monthlyChartRef.current) {
      monthlyChartRef.current.destroy();
    }

    // Create new chart and store the instance in ref
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

  // Function to render the category-based expenses chart
  const renderCategoryChart = (data: { month: string; total_category_expenses: number }[]) => {
    const ctx = document.getElementById("categoryChart") as HTMLCanvasElement;

    // Destroy existing chart if it exists
    if (categoryChartRef.current) {
      categoryChartRef.current.destroy();
    }

    // Create new chart and store the instance in ref
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

      {/* Monthly Income vs Expenses Chart */}
      <div className="chart-container">
        <h3>Monthly Income vs. Expenses</h3>
        <canvas id="monthlyChart"></canvas>
      </div>

      {/* Category-based Expenses Chart */}
      <div className="chart-container">
        <h3>Category-based Expenses</h3>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select a Category</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Rent">Rent</option>
          {/* Add other categories as necessary */}
        </select>
        <canvas id="categoryChart"></canvas>
      </div>
    </div>
  );
};

export default Reports;
