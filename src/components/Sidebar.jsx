import "./Sidebar.css";
import {
  LayoutDashboard,
  Map,
  FileText,
  Bell,
  Bookmark,
  UserRound,
  Settings,
  LogOut,
  Plus,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">
      {/* LOGO */}

      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">P</div>

        <span>PROHORI</span>
      </div>

      {/* REPORT BUTTON */}

      <button className="sidebar-report-btn">
        <Plus size={17} />
        Report Incident
      </button>

      {/* MAIN NAVIGATION */}

      <div className="sidebar-section">
        <span className="sidebar-section-title">MAIN</span>

        <nav className="sidebar-nav">
          <a href="/dashboard" className="sidebar-link active">
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </a>

          <a href="/map" className="sidebar-link">
            <Map size={19} />
            <span>Live Map</span>
          </a>

          <a href="/reports" className="sidebar-link">
            <FileText size={19} />
            <span>Reports</span>
          </a>

          <a href="/alerts" className="sidebar-link">
            <Bell size={19} />
            <span>Alerts</span>

            <span className="notification-count">3</span>
          </a>
        </nav>
      </div>

      {/* PERSONAL */}

      <div className="sidebar-section">
        <span className="sidebar-section-title">PERSONAL</span>

        <nav className="sidebar-nav">
          <a href="/saved" className="sidebar-link">
            <Bookmark size={19} />
            <span>Saved Areas</span>
          </a>

          <a href="/profile" className="sidebar-link">
            <UserRound size={19} />
            <span>Profile</span>
          </a>
        </nav>
      </div>

      {/* BOTTOM */}

      <div className="sidebar-bottom">
        <a href="/settings" className="sidebar-link">
          <Settings size={19} />
          <span>Settings</span>
        </a>

        <button className="sidebar-link logout-btn">
          <LogOut size={19} />
          <span>Log out</span>
        </button>

        {/* USER */}

        <div className="sidebar-user">
          <div className="user-avatar">F</div>

          <div className="user-info">
            <strong>Fahim</strong>
            <span>Member</span>
          </div>

          <div className="user-status"></div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
