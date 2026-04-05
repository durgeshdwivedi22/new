import {
  LayoutDashboard,
  Receipt,
  Lightbulb,
  Settings,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import "./Slidebar.css";

export default function Sidebar({ activeTab, setActiveTab, transactions = [] }) {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Overview",
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: Receipt,
      description: "Income & Expenses",
      badge: transactions.length,
    },
    {
      id: "insights",
      label: "Insights",
      icon: Lightbulb,
      description: "Analytics",
      badge: "New",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "Preferences",
    },
  ];

  return (
    <aside className="sidebar">
      
      {/* HEADER */}
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">F</div>
          <div>
            <h2>FinanceFlow</h2>
            <p>Finance Manager</p>
          </div>
        </div>

        <div className="status">
          <span className="dot"></span>
          Premium Active
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <div className="nav-icon">
                <Icon size={18} />
              </div>

              <div className="nav-text">
                <span>{item.label}</span>
                <small>{item.description}</small>
              </div>

              {item.badge && (
                <span className="badge">{item.badge}</span>
              )}

              {!isActive && <ArrowRight size={14} className="arrow" />}
            </button>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="sidebar-footer">
        <div className="tip-box">
          <div className="tip-title">
            <TrendingUp size={16} /> Pro Tip
          </div>
          <p>Automate savings to grow faster 🚀</p>
        </div>
      </div>
    </aside>
  );
}