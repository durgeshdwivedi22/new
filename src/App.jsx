import { useState, useEffect } from "react";
import Navbar from "./components/navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";
import Insights from "./components/Insights";
import "./components/components.css";

function App() {
  const [role, setRole] = useState("viewer");
  const [activeTab, setActiveTab] = useState("dashboard");

  const [settings, setSettings] = useState({
    profileVisibility: "Public",
    twoFactorAuth: true,
    themeMode: "Auto",
    dashboardDensity: "Comfortable",
    accentColor: "Blue",
    emailAlerts: true,
    pushNotifications: false,
    weeklySummary: true,
  });

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("finance_transactions");
    return saved ? JSON.parse(saved) : [];
  });

  // Save role
  useEffect(() => {
    localStorage.setItem("user_role", role);
  }, [role]);

  // Save transactions
  useEffect(() => {
    localStorage.setItem("finance_transactions", JSON.stringify(transactions));
  }, [transactions]);

  return (
    <div className="app-container">

      {/* 🔥 TOP NAVBAR */}
      <Navbar role={role} setRole={setRole} />

      {/* 🔥 LAYOUT */}
      <div className="layout">

        {/* SIDEBAR */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          transactions={transactions}
        />

        {/* MAIN CONTENT */}
        <main className="main-content">

          {activeTab === "dashboard" && (
            <Dashboard transactions={transactions} />
          )}

          {activeTab === "transactions" && (
            <Transactions
              transactions={transactions}
              setTransactions={setTransactions}
              role={role}
            />
          )}

          {activeTab === "insights" && (
            <Insights transactions={transactions} />
          )}

          {activeTab === "settings" && (
            <div className="settings-panel">
              <div className="settings-header">
                <div>
                  <h3>Settings</h3>
                  <p className="settings-subtitle">
                    Configure your dashboard experience, privacy, and notification preferences.
                  </p>
                </div>
                <div>
                  <button className="btn-professional btn-professional-primary">
                    Save changes
                  </button>
                </div>
              </div>

              <div className="settings-grid">
                <section className="settings-card card-professional">
                  <div className="settings-card-header">
                    <h4>Account</h4>
                    <p>Manage login and security preferences.</p>
                  </div>
                  <div className="settings-card-body">
                    <label className="settings-field">
                      <span>Profile visibility</span>
                      <select
                        className="settings-select"
                        value={settings.profileVisibility}
                        onChange={(e) => updateSetting("profileVisibility", e.target.value)}
                      >
                        <option>Public</option>
                        <option>Private</option>
                        <option>Connections only</option>
                      </select>
                    </label>

                    <label className="settings-switch-row">
                      <div>
                        <p>Two-factor authentication</p>
                        <span className="settings-field-description">
                          Add a second layer of protection for your account.
                        </span>
                      </div>
                      <span className="switch">
                        <input
                          type="checkbox"
                          checked={settings.twoFactorAuth}
                          onChange={(e) => updateSetting("twoFactorAuth", e.target.checked)}
                        />
                        <span className="slider" />
                      </span>
                    </label>

                    <button className="btn-professional btn-professional-secondary settings-action-button">
                      Reset password
                    </button>
                  </div>
                </section>

                <section className="settings-card card-professional">
                  <div className="settings-card-header">
                    <h4>Appearance</h4>
                    <p>Customize how the dashboard looks and feels.</p>
                  </div>
                  <div className="settings-card-body">
                    <label className="settings-field">
                      <span>Theme mode</span>
                      <select
                        className="settings-select"
                        value={settings.themeMode}
                        onChange={(e) => updateSetting("themeMode", e.target.value)}
                      >
                        <option>Auto</option>
                        <option>Light</option>
                        <option>Dark</option>
                      </select>
                    </label>

                    <label className="settings-field">
                      <span>Dashboard density</span>
                      <select
                        className="settings-select"
                        value={settings.dashboardDensity}
                        onChange={(e) => updateSetting("dashboardDensity", e.target.value)}
                      >
                        <option>Comfortable</option>
                        <option>Compact</option>
                        <option>Spacious</option>
                      </select>
                    </label>

                    <div className="settings-field">
                      <span>Accent color</span>
                      <div className="color-options">
                        {[
                          "Blue",
                          "Teal",
                          "Purple",
                          "Amber",
                          "Rose",
                        ].map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`color-chip ${settings.accentColor === color ? "active" : ""}`}
                            onClick={() => updateSetting("accentColor", color)}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="settings-card card-professional">
                  <div className="settings-card-header">
                    <h4>Notifications</h4>
                    <p>Control how you receive updates and summaries.</p>
                  </div>
                  <div className="settings-card-body">
                    <label className="settings-switch-row">
                      <div>
                        <p>Email alerts</p>
                        <span className="settings-field-description">
                          Receive important updates via email.
                        </span>
                      </div>
                      <span className="switch">
                        <input
                          type="checkbox"
                          checked={settings.emailAlerts}
                          onChange={(e) => updateSetting("emailAlerts", e.target.checked)}
                        />
                        <span className="slider" />
                      </span>
                    </label>

                    <label className="settings-switch-row">
                      <div>
                        <p>Push notifications</p>
                        <span className="settings-field-description">
                          Get quick alerts on your device.
                        </span>
                      </div>
                      <span className="switch">
                        <input
                          type="checkbox"
                          checked={settings.pushNotifications}
                          onChange={(e) => updateSetting("pushNotifications", e.target.checked)}
                        />
                        <span className="slider" />
                      </span>
                    </label>

                    <label className="settings-switch-row">
                      <div>
                        <p>Weekly summary</p>
                        <span className="settings-field-description">
                          Receive one concise summary email each week.
                        </span>
                      </div>
                      <span className="switch">
                        <input
                          type="checkbox"
                          checked={settings.weeklySummary}
                          onChange={(e) => updateSetting("weeklySummary", e.target.checked)}
                        />
                        <span className="slider" />
                      </span>
                    </label>
                  </div>
                </section>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default App;