import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon } from "lucide-react";
import "./Dashboard.css";

export default function Dashboard({ transactions = [] }) {
  const [chartType, setChartType] = useState("bar");

  // Calculate statistics
  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const balance = income - expenses;

    return { income, expenses, balance };
  }, [transactions]);

  // Prepare chart data
  const chartData = useMemo(() => {
    const months = {};

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!months[monthKey]) {
        months[monthKey] = { month: monthKey, income: 0, expenses: 0 };
      }

      if (t.type === "income") {
        months[monthKey].income += t.amount || 0;
      } else {
        months[monthKey].expenses += t.amount || 0;
      }
    });

    return Object.values(months)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12);
  }, [transactions]);

  // Prepare category data for pie chart
  const categoryData = useMemo(() => {
    const categories = {};

    transactions.forEach((t) => {
      if (t.type === "expense") {
        const category = t.category || "Other";
        categories[category] = (categories[category] || 0) + (t.amount || 0);
      }
    });

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
    }));
  }, [transactions]);

  // Recent transactions
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [transactions]);

  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Financial Overview</h2>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card card-income">
          <div className="card-content">
            <p className="card-label">Total Income</p>
            <h3 className="card-value">${stats.income.toFixed(2)}</h3>
          </div>
          <div className="card-icon">
            <TrendingUp size={28} />
          </div>
        </div>

        <div className="card card-expense">
          <div className="card-content">
            <p className="card-label">Total Expenses</p>
            <h3 className="card-value">${stats.expenses.toFixed(2)}</h3>
          </div>
          <div className="card-icon">
            <TrendingDown size={28} />
          </div>
        </div>

        <div className={`card ${stats.balance >= 0 ? "card-success" : "card-warning"}`}>
          <div className="card-content">
            <p className="card-label">Balance</p>
            <h3 className="card-value">${stats.balance.toFixed(2)}</h3>
          </div>
          <div className="card-icon">
            <DollarSign size={28} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-container">
        {/* Transactions Over Time */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Transactions Over Time</h3>
            <div className="chart-type-selector">
              <button
                className={`chart-btn ${chartType === "bar" ? "active" : ""}`}
                onClick={() => setChartType("bar")}
              >
                Bar
              </button>
              <button
                className={`chart-btn ${chartType === "line" ? "active" : ""}`}
                onClick={() => setChartType("line")}
              >
                Line
              </button>
            </div>
          </div>

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              {chartType === "bar" ? (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#10b981" name="Income" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                </BarChart>
              ) : (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#10b981" name="Income" />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Expenses" />
                </LineChart>
              )}
            </ResponsiveContainer>
          ) : (
            <p className="no-data">No transaction data available</p>
          )}
        </div>

        {/* Expense Breakdown */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Expense Breakdown</h3>
            <PieIcon size={20} />
          </div>

          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">No expense data available</p>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="transactions-preview">
        <h3>Recent Transactions</h3>

        {recentTransactions.length > 0 ? (
          <div className="transactions-list">
            {recentTransactions.map((t, index) => (
              <div key={index} className={`transaction-item ${t.type}`}>
                <div className="transaction-info">
                  <p className="transaction-description">{t.description || "Transaction"}</p>
                  <p className="transaction-category">{t.category || "Uncategorized"}</p>
                </div>
                <div className="transaction-details">
                  <p className={`transaction-amount ${t.type}`}>
                    {t.type === "income" ? "+" : "-"}${t.amount?.toFixed(2) || "0.00"}
                  </p>
                  <p className="transaction-date">
                    {new Date(t.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No transactions yet. Start adding transactions!</p>
        )}
      </div>
    </div>
  );
}
