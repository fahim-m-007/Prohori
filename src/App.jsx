import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";
import ReportIncident from "./pages/ReportIncident";
import LiveMap from "./pages/LiveMap";
import Reports from "./pages/Reports";
import SavedAreas from "./pages/SavedAreas";
import Profile from "./pages/Profile";

import DashboardLayout from "./layouts/DashboardLayout";
import { ReportsProvider } from "./context/ReportsContext";
import { SavedAreasProvider } from "./context/SavedAreasContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ReportsProvider>
          <SavedAreasProvider>
            <Routes>
              {/* ================================
            PUBLIC WEBSITE
        ================================= */}

              <Route element={<ProtectedRoute guestOnly />}>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Route>

              {/* ================================
            APPLICATION
        ================================= */}

              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  {/* Dashboard */}
                  <Route path="/dashboard" element={<Dashboard />} />

                  {/* Report an incident */}
                  <Route path="/report-incident" element={<ReportIncident />} />

                  {/* Live Map */}
                  <Route path="/map" element={<LiveMap />} />

                  {/* Reports */}
                  <Route path="/reports" element={<Reports />} />

                  {/* Saved Areas */}
                  <Route path="/saved" element={<SavedAreas />} />

                  {/* Profile */}
                  <Route path="/profile" element={<Profile />} />
                </Route>
              </Route>
            </Routes>
          </SavedAreasProvider>
        </ReportsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
