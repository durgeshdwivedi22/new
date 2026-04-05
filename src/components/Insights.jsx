import { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Target,
} from "lucide-react";
import "./Insights.css";

export default function Insights({ transactions = [] }) {
  // Calculate comprehensive statistics
  const stats = useMemo(() => {
    if (transactions.length === 0) {
      return {
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        avgMonthlyExpense: 0,
        avgTransaction: 0,
        largestExpense: 0,
        largestIncome: 0,
        transactionCount: 0,
        incomeCount: 0,
        expenseCount: 0,
      };
    }

    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const incomeTransactions = transactions.filter((t) => t.type === "income");
    const expenseTransactions = transactions.filter(
      (t) => t.type === "expense"
    );

    const largestExpense =
      expenseTransactions.length > 0
        ? Math.max(...expenseTransactions.map((t) => t.amount || 0))
        : 0;

    const largestIncome =
      incomeTransactions.length > 0
        ? Math.max(...incomeTransactions.map((t) => t.amount || 0))
        : 0;

    const avgTransaction =
      transactions.length > 0
        ? transactions.reduce((sum, t) => sum + (t.amount || 0), 0) /
          transactions.length
        : 0;

    // Calculate average monthly expense
    const months = {};
    transactions.forEach((t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      if (!months[monthKey]) months[monthKey] = 0;
      if (t.type === "expense") {
        months[monthKey] += t.amount || 0;
      }
    });

    const avgMonthlyExpense =
      Object.keys(months).length > 0
        ? Object.values(months).reduce((a, b) => a + b, 0) /
          Object.keys(months).length
        : 0;

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
      avgMonthlyExpense,
      avgTransaction,
      largestExpense,
      largestIncome,
      transactionCount: transactions.length,
      incomeCount: incomeTransactions.length,
      expenseCount: expenseTransactions.length,
    };
  }, [transactions]);

  // Monthly trend data
  const monthlyTrend = useMemo(() => {
    const months = {};

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!months[monthKey]) {
        months[monthKey] = {
          month: monthKey,
          income: 0,
          expenses: 0,
          balance: 0,
        };
      }

      if (t.type === "income") {
        months[monthKey].income += t.amount || 0;
      } else {
        months[monthKey].expenses += t.amount || 0;
      }
    });

    return Object.values(months)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((m) => ({
        ...m,
        balance: m.income - m.expenses,
      }))
      .slice(-12);
  }, [transactions]);

  // Category spending
  const categorySpending = useMemo(() => {
    const categories = {};

    transactions.forEach((t) => {
      if (t.type === "expense") {
        const category = t.category || "Other";
        categories[category] = (categories[category] || 0) + (t.amount || 0);
      }
    });

    return Object.entries(categories)
      .map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2)),
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Spending by day of week
  const spendingByDay = useMemo(() => {
    const days = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0,
    };

    transactions.forEach((t) => {
      if (t.type === "expense") {
        const date = new Date(t.date);
        const dayNames = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const dayName = dayNames[date.getDay()];
        days[dayName] += t.amount || 0;
      }
    });

    return Object.entries(days).map(([day, amount]) => ({
      day: day.substring(0, 3),
      amount: parseFloat(amount.toFixed(2)),
    }));
  }, [transactions]);

  // Generate insights and recommendations
  const insights = useMemo(() => {
    const recommendations = [];

    // Check savings rate
    if (stats.totalIncome > 0) {
      const savingsRate = (stats.balance / stats.totalIncome) * 100;
      if (savingsRate < 10) {
        recommendations.push({
          type: "warning",
          title: "Low Savings Rate",
          message: `Your savings rate is ${savingsRate.toFixed(1)}%. Try to save at least 20% of your income.`,
        });
      } else if (savingsRate >= 20) {
        recommendations.push({
          type: "success",
          title: "Great Savings",
          message: `Excellent! You're saving ${savingsRate.toFixed(1)}% of your income.`,
        });
      }
    }

    // Check largest expense
    if (stats.largestExpense > stats.avgMonthlyExpense * 0.3) {
      recommendations.push({
        type: "warning",
        title: "High Individual Expense",
        message: `Your largest expense ($${stats.largestExpense.toFixed(
          2
        )}) is quite high. Review if it's a one-time or recurring cost.`,
      });
    }

    // Check spending patterns
    if (categorySpending.length > 0) {
      const topCategory = categorySpending[0];
      const topCategoryPercent =
        (topCategory.value / stats.totalExpenses) * 100;
      if (topCategoryPercent > 40) {
        recommendations.push({
          type: "warning",
          title: "High Spending on Single Category",
          message: `${topCategory.name} accounts for ${topCategoryPercent.toFixed(
            1
          )}% of your spending. Consider diversifying.`,
        });
      }
    }

    // Check transaction frequency
    if (stats.transactionCount > 0) {
      const avgPerDay = stats.transactionCount / 30;
      if (avgPerDay > 2) {
        recommendations.push({
          type: "info",
          title: "High Transaction Frequency",
          message: `You're averaging ${avgPerDay.toFixed(
            1
          )} transactions per day. Small frequent purchases add up!`,
        });
      }
    }

    // Balance check
    if (stats.balance < 0) {
      recommendations.push({
        type: "warning",
        title: "Negative Balance",
        message: "You're spending more than you earn. Time to review expenses!",
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: "success",
        title: "Financial Health Good",
        message: "Your finances look balanced. Keep up the good spending habits!",
      });
    }

    return recommendations;
  }, [stats, categorySpending]);

  return (
    <div className="insights-container">
      <h2 className="insights-title">Financial Insights & Analytics</h2>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon income">
            <TrendingUp size={24} />
          </div>
          <div className="metric-content">
            <p className="metric-label">Total Income</p>
            <h3 className="metric-value">${stats.totalIncome.toFixed(2)}</h3>
            <p className="metric-subtext">{stats.incomeCount} transactions</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon expense">
            <TrendingDown size={24} />
          </div>
          <div className="metric-content">
            <p className="metric-label">Total Expenses</p>
            <h3 className="metric-value">${stats.totalExpenses.toFixed(2)}</h3>
            <p className="metric-subtext">{stats.expenseCount} transactions</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon balance">
            <Target size={24} />
          </div>
          <div className="metric-content">
            <p className="metric-label">Net Balance</p>
            <h3
              className="metric-value"
              style={{
                color: stats.balance >= 0 ? "#10b981" : "#ef4444",
              }}
            >
              ${stats.balance.toFixed(2)}
            </h3>
            <p className="metric-subtext">
              {stats.totalIncome > 0
                ? `${((stats.balance / stats.totalIncome) * 100).toFixed(1)}% savings rate`
                : "No income"}
            </p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon average">
            <CheckCircle size={24} />
          </div>
          <div className="metric-content">
            <p className="metric-label">Avg Monthly Expense</p>
            <h3 className="metric-value">
              ${stats.avgMonthlyExpense.toFixed(2)}
            </h3>
            <p className="metric-subtext">
              Avg per transaction: ${stats.avgTransaction.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Monthly Trend */}
        {monthlyTrend.length > 0 && (
          <div className="chart-container">
            <h3>Monthly Balance Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  name="Income"
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  name="Expenses"
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#3b82f6"
                  name="Balance"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Category Breakdown */}
        {categorySpending.length > 0 && (
          <div className="chart-container">
            <h3>Top Spending Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={categorySpending.slice(0, 8)}
                layout="vertical"
                margin={{ left: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={95} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Spending by Day */}
        {spendingByDay.some((d) => d.amount > 0) && (
          <div className="chart-container">
            <h3>Spending by Day of Week</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={spendingByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Insights & Recommendations */}
      <div className="recommendations-section">
        <h3>Recommendations & Insights</h3>
        <div className="recommendations-grid">
          {insights.map((insight, index) => (
            <div key={index} className={`recommendation-card ${insight.type}`}>
              <div className="recommendation-icon">
                {insight.type === "success" ? (
                  <CheckCircle size={24} />
                ) : insight.type === "warning" ? (
                  <AlertCircle size={24} />
                ) : (
                  <AlertCircle size={24} />
                )}
              </div>
              <div className="recommendation-content">
                <h4>{insight.title}</h4>
                <p>{insight.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="summary-stats">
        <h3>Summary Statistics</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total Transactions</span>
            <span className="stat-value">{stats.transactionCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Largest Expense</span>
            <span className="stat-value">${stats.largestExpense.toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Largest Income</span>
            <span className="stat-value">${stats.largestIncome.toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Expense Categories</span>
            <span className="stat-value">{categorySpending.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
