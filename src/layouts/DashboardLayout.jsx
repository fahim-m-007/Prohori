import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import "./DashboardLayout.css";

function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={`dashboard-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar collapsed={sidebarCollapsed} />

      <button
        type="button"
        className="sidebar-toggle"
        onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
        aria-label={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
        title={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
      >
        {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
