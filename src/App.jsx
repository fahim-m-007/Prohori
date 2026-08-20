import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import ReportIncident from "./pages/ReportIncident";
import DashboardLayout from "./layouts/DashboardLayout";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================================
            PUBLIC WEBSITE
        ================================= */}

        <Route path="/" element={<Landing />} />

        {/* ================================
            APPLICATION
        ================================= */}

        <Route element={<DashboardLayout />}>
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Report an incident */}
          <Route path="/report-incident" element={<ReportIncident />} />

          {/* Live Map */}
          <Route
            path="/map"
            element={<div className="temporary-page">Live Map</div>}
          />

          {/* Reports */}
          <Route
            path="/reports"
            element={<div className="temporary-page">Reports</div>}
          />

          {/* Alerts */}
          <Route
            path="/alerts"
            element={<div className="temporary-page">Alerts</div>}
          />

          {/* Saved Areas */}
          <Route
            path="/saved"
            element={<div className="temporary-page">Saved Areas</div>}
          />

          {/* Profile */}
          <Route
            path="/profile"
            element={<div className="temporary-page">Profile</div>}
          />

          {/* Settings */}
          <Route
            path="/settings"
            element={<div className="temporary-page">Settings</div>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
