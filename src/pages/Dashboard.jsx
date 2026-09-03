import {
  AlertTriangle,
  ArrowRight,
  FileText,
  MapPin,
  ShieldPlus,
  ShieldCheck,
  Building2,
  Home,
  GraduationCap,
  Bookmark,
  ThumbsUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { useReports } from "../context/ReportsContext";
import { useSavedAreas } from "../context/SavedAreasContext";

import "./Dashboard.css";

function Dashboard() {
  const { reports, setReports } = useReports();
  const { savedAreas } = useSavedAreas();

  const handleVote = (id) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          if (r.userVoted === "up") {
            return { ...r, upvotes: r.upvotes - 1, userVoted: null };
          } else {
            return { ...r, upvotes: r.upvotes + 1, userVoted: "up" };
          }
        }
        return r;
      })
    );
  };

  // Determine the primary area to show in the header card
  const primaryArea = savedAreas.length > 0 ? savedAreas[0] : null;
  const displayThana = primaryArea ? primaryArea.thana : "Dhaka City";

  // Filter reports that belong to any of the user's saved areas
  const relevantReports = reports.filter((r) =>
    savedAreas.some((area) => area.thana === r.thana)
  );

  // If no relevant reports, just show recent global reports
  const displayReports = (relevantReports.length > 0 ? relevantReports : reports).slice(0, 4);

  const getSeverityClass = (severity) => {
    switch (severity) {
      case "high": return "red";
      case "caution": return "orange";
      case "resolved": return "blue";
      default: return "purple";
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case "residential":
        return <Home size={14} />;
      case "work":
        return <Building2 size={14} />;
      case "campus":
        return <GraduationCap size={14} />;
      default:
        return <Bookmark size={14} />;
    }
  };

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <header className="dashboard-header">
        <div>
          <span className="dashboard-label">COMMUNITY SAFETY</span>
          <h1>Good morning, Fahim 👋</h1>
          <p>See what&apos;s happening in your selected areas.</p>
        </div>

        <div className="dashboard-actions">
          <Link
            to="/profile"
            className="header-avatar"
            aria-label="Open profile"
          >
            F
          </Link>
        </div>
      </header>

      <main className="dashboard-content">
        {/* SELECTED THANA */}
        <section className="thana-card">
          <div>
            <span className="section-label">
              <MapPin size={13} />
              PRIMARY AREA
            </span>
            <h2>{displayThana}</h2>
            <p>
              {primaryArea 
                ? `Safety overview for your saved location: ${primaryArea.name}`
                : "Add a saved area to get personalized neighborhood updates."}
            </p>
          </div>

          <div className="thana-count">
            <strong>{relevantReports.length}</strong>
            <span>reports<br />nearby</span>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="dashboard-grid">
          {/* RECENT REPORTS */}
          <div className="dashboard-card reports-card">
            <div className="card-header">
              <div>
                <span className="card-label">COMMUNITY FEED</span>
                <h2>Recent Reports</h2>
              </div>
              <Link to="/reports" className="view-link">
                View all
                <ArrowRight size={12} />
              </Link>
            </div>

            {displayReports.length === 0 ? (
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', padding: '10px 0' }}>No recent reports available.</p>
            ) : (
              displayReports.map((report) => (
                <div className="report-item" key={report.id}>
                  <div className={`report-icon ${getSeverityClass(report.severity)}`}>
                    {report.severity === "resolved" ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />}
                  </div>

                  <div className="report-content">
                    <div className="report-top">
                      <strong>{report.title}</strong>
                      <small>{report.time}</small>
                    </div>

                    <span className="report-location">
                      <MapPin size={11} />
                      {report.location} ({report.thana})
                    </span>

                    <span className="report-category">
                      {report.category}
                    </span>

                    <p>{report.description}</p>

                    <div className="report-actions">
                      <Link to="/reports" style={{ fontSize: '8px', fontWeight: '700', color: 'var(--blue)', textDecoration: 'none' }}>
                        View in Feed
                      </Link>

                      <button 
                        className={`flag-button ${report.userVoted === "up" ? "voted" : ""}`} 
                        style={{ cursor: 'pointer', color: report.userVoted === "up" ? 'var(--blue)' : '' }}
                        onClick={() => handleVote(report.id)}
                      >
                        <ThumbsUp size={12} />
                        {report.upvotes}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="dashboard-side">
            {/* SAVED AREAS OVERVIEW */}
            <div className="dashboard-card">
              <div className="card-header">
                <div>
                  <span className="card-label">MONITORING</span>
                  <h2>Your Saved Areas</h2>
                </div>
                <Link to="/saved" className="view-link">
                  Manage
                </Link>
              </div>

              {savedAreas.length === 0 ? (
                <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>You haven't saved any locations yet.</p>
              ) : (
                savedAreas.slice(0, 3).map((area) => (
                  <div className="alert-item" key={area.id}>
                    <div className="small-icon" style={{ background: '#f8fafc', color: 'var(--navy)' }}>
                      {getCategoryIcon(area.category)}
                    </div>
                    <div>
                      <strong>{area.name}</strong>
                      <span>{area.thana}</span>
                      <small>Safety Score: {area.safetyScore}/100</small>
                    </div>
                  </div>
                ))
              )}

              <Link to="/saved" className="side-link">
                View all saved areas
                <ArrowRight size={12} />
              </Link>
            </div>

            {/* MY CONTRIBUTIONS (MOCK) */}
            <div className="dashboard-card">
              <div className="card-header">
                <div>
                  <span className="card-label">YOUR ACTIVITY</span>
                  <h2>My Contributions</h2>
                </div>
                <Link to="/profile" className="view-link">
                  View Profile
                </Link>
              </div>

              <div className="my-report">
                <div className="small-icon blue">
                  <FileText size={14} />
                </div>
                <div>
                  <strong>Verified a report</strong>
                  <span>Satmasjid Road</span>
                </div>
                <small>Today</small>
              </div>

              <div className="my-report">
                <div className="small-icon purple">
                  <MapPin size={14} />
                </div>
                <div>
                  <strong>Added a comment</strong>
                  <span>Dhanmondi 27</span>
                </div>
                <small>Yesterday</small>
              </div>

              <div className="my-report">
                <div className="small-icon green" style={{ background: '#ecfdf5', color: '#10b981' }}>
                  <ShieldCheck size={14} />
                </div>
                <div>
                  <strong>Marked area safe</strong>
                  <span>Gulshan</span>
                </div>
                <small>3 days ago</small>
              </div>
            </div>
          </div>
        </section>

        {/* REPORT CTA */}
        <section className="dashboard-report-card">
          <Link
            to="/report-incident"
            className="dashboard-report-icon"
            aria-label="Report an incident"
          >
            <ShieldPlus size={24} strokeWidth={1.9} />
          </Link>
          <div className="dashboard-report-content">
            <span className="card-label">HELP YOUR COMMUNITY</span>
            <h2>See something that matters?</h2>
            <p>Report a safety or civic issue in your area.</p>
          </div>
          <Link
            to="/report-incident"
            className="dashboard-report-button"
          >
            Report an incident
            <ArrowRight size={14} />
          </Link>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
