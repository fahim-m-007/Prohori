import {
  AlertTriangle,
  ArrowRight,
  Bookmark,
  Building2,
  Clock,
  FileText,
  GraduationCap,
  Home,
  MapPin,
  ShieldCheck,
  ShieldPlus,
  Sparkles,
  ThumbsUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useReports } from "../context/ReportsContext";
import { useSavedAreas } from "../context/SavedAreasContext";
import { useAuth } from "../context/AuthContext";
import ReportDetailModal from "../components/ReportDetailModal";

import "./Dashboard.css";

function Dashboard() {
  const { reports, voteReport, deleteReport } = useReports();
  const { savedAreas } = useSavedAreas();
  const { user } = useAuth();
  const displayName = user?.name || "there";
  const userInitial = displayName.charAt(0).toUpperCase();

  const [votingId, setVotingId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [activeReportModal, setActiveReportModal] = useState(null);

  // Keep active report fresh if reports list updates
  useEffect(() => {
    if (!activeReportModal) return;
    const latest = reports.find(
      (r) =>
        String(r.id || r._id) ===
        String(activeReportModal.id || activeReportModal._id),
    );
    if (latest) {
      setActiveReportModal(latest);
    }
  }, [reports, activeReportModal]);

  const handleDeleteReport = async (reportId) => {
    if (deleteReport) {
      await deleteReport(reportId);
      setActiveReportModal(null);
      showToast("Report deleted successfully.");
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleVote = async (id) => {
    if (votingId) return;
    setVotingId(id);
    try {
      const updated = await voteReport(id);
      showToast(
        updated?.userVoted === "up"
          ? "Confirmed incident! Thank you for verifying."
          : "Vote removed.",
      );
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to update confirmation.",
      );
    } finally {
      setVotingId(null);
    }
  };

  // Determine the primary area to show in the header card
  const primaryArea = savedAreas.length > 0 ? savedAreas[0] : null;
  const accountThana = user?.thana?.trim();
  const displayThana =
    accountThana || (primaryArea ? primaryArea.thana : "Dhaka City");

  // Prefer the thana selected at registration; fall back to demo saved areas.
  const relevantReports = accountThana
    ? reports.filter((report) => report.thana === accountThana)
    : reports.filter((report) =>
        savedAreas.some((area) => area.thana === report.thana),
      );

  // If no relevant reports, just show recent global reports
  const displayReports = (
    relevantReports.length > 0 ? relevantReports : reports
  ).slice(0, 4);

  // User's own incident reports for activity widget
  const currentUserId = user?.id || user?._id;
  const myReports = useMemo(() => {
    if (!reports || !currentUserId) return [];
    return reports
      .filter((r) => {
        if (!r.reportedBy) return false;
        return (
          String(r.reportedBy) === String(currentUserId) ||
          (user?._id && String(r.reportedBy) === String(user._id))
        );
      })
      .slice(0, 3);
  }, [reports, currentUserId, user]);

  const getSeverityClass = (severity) => {
    switch (severity) {
      case "high":
        return "red";
      case "caution":
        return "orange";
      case "resolved":
        return "blue";
      default:
        return "purple";
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
      {/* TOAST */}
      {toastMessage && (
        <div className="dashboard-toast">
          <Sparkles size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER */}
      <header className="dashboard-header">
        <div>
          <span className="dashboard-label">COMMUNITY SAFETY</span>
          <h1>Good morning, {displayName} 👋</h1>
          <p>See what&apos;s happening in your selected areas.</p>
        </div>

        <div className="dashboard-actions">
          <Link
            to="/profile"
            className="header-avatar"
            aria-label="Open profile"
          >
            {userInitial}
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
              {accountThana
                ? "Safety overview for the thana selected in your account."
                : primaryArea
                  ? `Safety overview for your saved location: ${primaryArea.name}`
                  : "Add a saved area to get personalized neighborhood updates."}
            </p>
          </div>

          <div className="thana-count">
            <strong>{relevantReports.length}</strong>
            <span>
              reports
              <br />
              nearby
            </span>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="dashboard-grid">
          {/* LOCAL REPORTS */}
          <div className="dashboard-card reports-card">
            <div className="card-header">
              <div>
                <span className="card-label">LOCAL FEED</span>
                <h2>Local Reports</h2>
              </div>
              <Link to="/reports" className="view-link">
                View all
                <ArrowRight size={12} />
              </Link>
            </div>

            {displayReports.length === 0 ? (
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  padding: "10px 0",
                }}
              >
                No local reports available in {displayThana}.
              </p>
            ) : (
              displayReports.map((report) => (
                <div className="report-item" key={report.id || report._id}>
                  <div
                    className={`report-icon ${getSeverityClass(report.severity)}`}
                    onClick={() => setActiveReportModal(report)}
                    style={{ cursor: "pointer" }}
                    title="Click to view details"
                  >
                    {report.severity === "resolved" ? (
                      <ShieldCheck size={18} />
                    ) : (
                      <AlertTriangle size={18} />
                    )}
                  </div>

                  <div className="report-content">
                    <div className="report-card-top">
                      <span className="cat-tag">{report.category}</span>
                      <div className="time-tag">
                        <Clock size={12} />
                        <span>{report.time}</span>
                      </div>
                    </div>

                    <h3
                      className="report-heading"
                      onClick={() => setActiveReportModal(report)}
                      style={{ cursor: "pointer" }}
                      title="Click to view details"
                    >
                      {report.title}
                    </h3>

                    <div className="report-author-meta">
                      <span className="author-label">Reported by:</span>
                      <span className="author-name">
                        {report.reporterName || "Citizen Reporter"}
                      </span>
                    </div>

                    <div className="report-location-badge">
                      <MapPin size={12} className="loc-pin" />
                      <span>{report.location}</span>
                    </div>

                    <p
                      className="report-desc-preview"
                      onClick={() => setActiveReportModal(report)}
                      style={{ cursor: "pointer" }}
                      title="Click to view details"
                    >
                      {report.description}
                    </p>

                    {Array.isArray(report.images) && report.images.length > 0 && (
                      <div
                        className="dashboard-report-images"
                        onClick={() => setActiveReportModal(report)}
                        title="Click to view attached photos"
                      >
                        {report.images.slice(0, 2).map((imgUrl, idx) => (
                          <div className="dashboard-report-img-thumb" key={idx}>
                            <img
                              src={imgUrl}
                              alt={`Incident photo ${idx + 1}`}
                              loading="lazy"
                            />
                          </div>
                        ))}
                        {report.images.length > 2 && (
                          <div className="dashboard-report-img-more">
                            +{report.images.length - 2}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="report-actions">

                      <button
                        type="button"
                        className={`flag-button ${report.userVoted === "up" ? "voted" : ""}`}
                        style={{
                          cursor:
                            votingId === (report.id || report._id)
                              ? "wait"
                              : "pointer",
                          color: report.userVoted === "up" ? "var(--blue)" : "",
                        }}
                        onClick={() => handleVote(report.id || report._id)}
                        disabled={votingId === (report.id || report._id)}
                        title={
                          report.userVoted === "up"
                            ? "Remove confirmation"
                            : "Confirm incident"
                        }
                        aria-label={
                          report.userVoted === "up"
                            ? "Remove confirmation"
                            : "Confirm incident"
                        }
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
                <p style={{ fontSize: "10px", color: "var(--text-secondary)" }}>
                  You haven't saved any locations yet.
                </p>
              ) : (
                savedAreas.slice(0, 3).map((area) => (
                  <div className="alert-item" key={area.id || area._id}>
                    <div
                      className="small-icon"
                      style={{ background: "#f8fafc", color: "var(--navy)" }}
                    >
                      {getCategoryIcon(area.category)}
                    </div>
                    <div>
                      <strong>{area.name}</strong>
                      <span>{area.thana}</span>
                      <small>{area.address || `${area.thana}, Dhaka`}</small>
                    </div>
                  </div>
                ))
              )}

              <Link to="/saved" className="side-link">
                View all saved areas
                <ArrowRight size={12} />
              </Link>
            </div>

            {/* MY CONTRIBUTIONS */}
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

              {myReports.length === 0 ? (
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    padding: "10px 0",
                    lineHeight: "1.5",
                  }}
                >
                  You haven&apos;t logged any reports yet. Report incidents to keep your neighborhood safe.
                </p>
              ) : (
                myReports.map((r) => (
                  <div
                    className="my-report"
                    key={r.id || r._id}
                    onClick={() => setActiveReportModal(r)}
                    style={{ cursor: "pointer" }}
                    title="Click to view details"
                  >
                    <div
                      className={`small-icon ${getSeverityClass(r.severity)}`}
                    >
                      <FileText size={14} />
                    </div>
                    <div>
                      <strong>{r.title}</strong>
                      <span>
                        <MapPin size={11} /> {r.location} ({r.thana})
                      </span>
                    </div>
                    <small>{r.time}</small>
                  </div>
                ))
              )}
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
          <Link to="/report-incident" className="dashboard-report-button">
            Report an incident
            <ArrowRight size={14} />
          </Link>
        </section>
      </main>

      {/* REPORT DETAIL MODAL */}
      {activeReportModal && (
        <ReportDetailModal
          report={activeReportModal}
          onClose={() => setActiveReportModal(null)}
          onToast={showToast}
          onDeleteReport={handleDeleteReport}
        />
      )}
    </div>
  );
}

export default Dashboard;
