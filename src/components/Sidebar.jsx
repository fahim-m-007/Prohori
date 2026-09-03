import "./Sidebar.css";
import {
  LayoutDashboard,
  Map,
  FileText,
  Bookmark,
  UserRound,
  LogOut,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";

function Sidebar({ collapsed = false, onToggle }) {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* LOGO */}
      <div className="sidebar-brand">
        <Link to="/dashboard" className="sidebar-logo">
          <div className="sidebar-logo-mark">P</div>
          <span>PROHORI</span>
        </Link>
        <button
          type="button"
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={collapsed ? "Show sidebar" : "Hide sidebar"}
          title={collapsed ? "Show sidebar" : "Hide sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* REPORT BUTTON */}
      <Link to="/report-incident" className="sidebar-report-btn">
        <Plus size={17} />
        <span>Report Incident</span>
      </Link>

      {/* MAIN NAVIGATION */}
      <div className="sidebar-section">
        <span className="sidebar-section-title">MAIN</span>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/map"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Map size={19} />
            <span>Live Map</span>
          </NavLink>

          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <FileText size={19} />
            <span>Reports</span>
          </NavLink>
        </nav>
      </div>

      {/* PERSONAL */}
      <div className="sidebar-section">
        <span className="sidebar-section-title">PERSONAL</span>

        <nav className="sidebar-nav">
          <NavLink
            to="/saved"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Bookmark size={19} />
            <span>Saved Areas</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <UserRound size={19} />
            <span>Profile</span>
          </NavLink>
        </nav>
      </div>

      {/* BOTTOM */}
      <div className="sidebar-bottom">
        <Link to="/login" className="sidebar-link logout-btn">
          <LogOut size={19} />
          <span>Log out</span>
        </Link>

        {/* USER */}
        <Link to="/profile" className="sidebar-user">
          <div className="user-avatar">F</div>

          <div className="user-info">
            <strong>Fahim</strong>
            <span>Verified Member</span>
          </div>

          <div className="user-status" title="Online"></div>
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;
