import { useState, useEffect, useRef } from "react";
import { Sun, Moon, User, Settings, LogOut } from "lucide-react";
import "./Navbar.css";

export default function Navbar({ role, setRole }) {
  const [darkMode, setDarkMode] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-content">

        {/* Logo */}
        <div className="navbar-brand">
          <div className="navbar-brand-icon">F</div>
          <h1 className="navbar-title">FinanceFlow</h1>
        </div>

        {/* Right */}
        <div className="navbar-actions">

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="role-select"
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>

          <button
            className="btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="profile-section" ref={dropdownRef}>
            <div
              className="profile-icon"
              onClick={() => setOpenDropdown(!openDropdown)}
            >
              <User size={18} />
            </div>

            {openDropdown && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-item">Profile</div>
                <div className="profile-dropdown-item">Settings</div>
                <div className="profile-dropdown-item logout">Logout</div>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
