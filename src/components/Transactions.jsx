import { useState, useMemo } from "react";
import { Trash2, Edit2, Check, X } from "lucide-react";
import "./Transaction.css";

export default function Transactions({ transactions, setTransactions }) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
  });

  const [editingId, setEditingId] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  // Get unique categories
  const categories = useMemo(
    () => ["Food", "Transportation", "Entertainment", "Utilities", "Healthcare", "Shopping", "Other"],
    []
  );

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter((t) => {
      const typeMatch = filterType === "all" || t.type === filterType;
      const categoryMatch = filterCategory === "all" || t.category === filterCategory;
      return typeMatch && categoryMatch;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "date-desc") {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === "date-asc") {
        return new Date(a.date) - new Date(b.date);
      } else if (sortBy === "amount-desc") {
        return (b.amount || 0) - (a.amount || 0);
      } else if (sortBy === "amount-asc") {
        return (a.amount || 0) - (b.amount || 0);
      }
      return 0;
    });

    return filtered;
  }, [transactions, filterType, filterCategory, sortBy]);

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || "" : value,
    }));
  };

  // Add or update transaction
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.description || !formData.amount || formData.amount <= 0) {
      alert("Please fill in all fields with valid amounts");
      return;
    }

    if (editingId !== null) {
      // Update existing transaction
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? {
                ...t,
                ...formData,
                amount: parseFloat(formData.amount),
              }
            : t
        )
      );
      setEditingId(null);
    } else {
      // Add new transaction
      const newTransaction = {
        id: Date.now(),
        ...formData,
        amount: parseFloat(formData.amount),
      };
      setTransactions((prev) => [newTransaction, ...prev]);
    }

    // Reset form
    setFormData({
      description: "",
      amount: "",
      type: "expense",
      category: "Food",
      date: new Date().toISOString().split("T")[0],
    });
  };

  // Edit transaction
  const handleEdit = (transaction) => {
    setFormData({
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
    });
    setEditingId(transaction.id);
  };

  // Delete transaction
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      description: "",
      amount: "",
      type: "expense",
      category: "Food",
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <div className="transactions-container">
      {/* Form Section */}
      <div className="form-section">
        <h2>{editingId ? "Edit Transaction" : "Add Transaction"}</h2>

        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-row">
            <div className="form-group">
              <label>Description *</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="e.g., Grocery shopping"
                required
              />
            </div>

            <div className="form-group">
              <label>Amount *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              {editingId ? "Update" : "Add"} Transaction
            </button>
            {editingId && (
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Filter & Sort Section */}
      <div className="filter-section">
        <div className="filter-group">
          <label>Filter by Type:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Filter by Category:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date-desc">Date (Newest)</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="amount-desc">Amount (High to Low)</option>
            <option value="amount-asc">Amount (Low to High)</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="list-section">
        <h2>Transaction History ({filteredTransactions.length})</h2>

        {filteredTransactions.length > 0 ? (
          <div className="transactions-table">
            <div className="table-header">
              <div className="col-date">Date</div>
              <div className="col-description">Description</div>
              <div className="col-category">Category</div>
              <div className="col-type">Type</div>
              <div className="col-amount">Amount</div>
              <div className="col-actions">Actions</div>
            </div>

            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`table-row ${transaction.type}`}
              >
                <div className="col-date">
                  {new Date(transaction.date).toLocaleDateString()}
                </div>
                <div className="col-description">{transaction.description}</div>
                <div className="col-category">{transaction.category}</div>
                <div className="col-type">
                  <span className={`badge ${transaction.type}`}>
                    {transaction.type}
                  </span>
                </div>
                <div className={`col-amount ${transaction.type}`}>
                  {transaction.type === "income" ? "+" : "-"}$
                  {transaction.amount?.toFixed(2) || "0.00"}
                </div>
                <div className="col-actions">
                  <button
                    className="btn-icon edit"
                    onClick={() => handleEdit(transaction)}
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="btn-icon delete"
                    onClick={() => handleDelete(transaction.id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-transactions">
            No transactions found. {transactions.length === 0 ? "Add your first transaction!" : ""}
          </p>
        )}
      </div>
    </div>
  );
}
