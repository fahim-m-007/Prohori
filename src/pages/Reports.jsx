import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  MapPin,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  ThumbsUp,
  X,
} from "lucide-react";
import "./Reports.css";
import { useReports } from "../context/ReportsContext";
import ReportDetailModal from "../components/ReportDetailModal";

const categories = [
  "All Categories",
  "Road accident",
  "Traffic disruption",
  "Waterlogging",
  "Theft",
  "Mugging",
  "Violence",
  "Hijacking",
  "Fire & Explosion",
  "Protest Blockade",
  "Other",
];

const thanas = [
  "All Thanas",
  "Adabor",
  "Airport / Bimanbandar",
  "Badda",
  "Banani",
  "Bangshal",
  "Bhashantek",
  "Cantonment",
  "Chalkbazar",
  "Dakshinkhan",
  "Darus-Salam",
  "Demra",
  "Dhanmondi",
  "Gandaria",
  "Gulshan",
  "Hatirjheel",
  "Hazaribagh",
  "Jatrabari",
  "Kadamtoli",
  "Kafrul",
  "Kalabagan",
  "Kamrangirchar",
  "Khilgaon",
  "Khilkhet",
  "Kotwali",
  "Lalbagh",
  "Mirpur Model",
  "Mohammadpur",
  "Motijheel",
  "Mugda",
  "New Market",
  "Pallabi",
  "Paltan Model",
  "Ramna Model",
  "Rampura",
  "Rupnagar",
  "Sabujbag",
  "Shah Ali",
  "Shahbag",
  "Shahjahanpur",
  "Sher-e-Bangla Nagar",
  "Shyampur",
  "Sutrapur",
  "Tejgaon",
  "Tejgaon Industrial Area",
  "Turag",
  "Uttarkhan",
  "Uttara East",
  "Uttara West",
  "Vatara",
  "Wari",
];

function Reports() {
  const { reports, voteReport, isLoadingReports } = useReports();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedThana, setSelectedThana] = useState("All Thanas");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [activeDetailModal, setActiveDetailModal] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleVote = async (id) => {
    try {
      const updated = await voteReport(id);
      showToast(
        updated.userVoted === "up"
          ? "Confirmed incident! Thank you for verifying."
          : "Vote removed.",
      );
      if (activeDetailModal && activeDetailModal.id === id) {
        setActiveDetailModal(updated);
      }
    } catch (err) {
      showToast(
        err.response?.data?.message || "Please log in to confirm incidents.",
      );
    }
  };

  const filteredReports = useMemo(() => {
    return reports
      .filter((r) => {
        const matchesSearch =
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat =
          selectedCategory === "All Categories" ||
          r.category === selectedCategory;
        const matchesThana =
          selectedThana === "All Thanas" || r.thana === selectedThana;
        const matchesStatus =
          selectedStatus === "all" || r.status === selectedStatus;
        return matchesSearch && matchesCat && matchesThana && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "upvotes") return b.upvotes - a.upvotes;
        return 0;
      });
  }, [
    reports,
    searchQuery,
    selectedCategory,
    selectedThana,
    selectedStatus,
    sortBy,
  ]);

  return (
    <div className="reports-page">
      {/* TOAST */}
      {toastMessage && (
        <div className="reports-toast">
          <Sparkles size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER */}
      <header className="reports-header">
        <div>
          <div className="reports-badge">
            <FileText size={14} />
            <span>COMMUNITY INCIDENT ARCHIVE</span>
          </div>
          <h1>Dhaka Incident Reports & Feed</h1>
          <p>
            Explore crowdsourced safety reports across all 50+ Thanas. Confirm
            active hazards and keep your community informed.
          </p>
        </div>

        <Link to="/report-incident" className="btn-report-action">
          <Plus size={16} />
          <span>Report an Incident</span>
        </Link>
      </header>

      {/* SEARCH AND FILTERS BAR */}
      <div className="reports-filters-card">
        <div className="search-input-wrap">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search reports by street, road, keyword (e.g. Satmasjid, waterlogging, fire)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchQuery("")}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="filters-row">
          <div className="select-wrap">
            <label>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="select-wrap">
            <label>Thana Area</label>
            <select
              value={selectedThana}
              onChange={(e) => setSelectedThana(e.target.value)}
            >
              {thanas.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="select-wrap">
            <label>Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="select-wrap">
            <label>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recent">Most Recent</option>
              <option value="upvotes">Most Confirmed</option>
            </select>
          </div>
        </div>
      </div>

      {/* FEED METRICS */}
      <div className="reports-feed-count">
        {isLoadingReports ? (
          <span>Loading live reports from MongoDB...</span>
        ) : (
          <span>Showing {filteredReports.length} results</span>
        )}
      </div>

      {/* REPORTS LIST */}
      <div className="reports-cards-grid">
        {isLoadingReports ? (
          <div className="no-reports-card">
            <div className="spinner-md"></div>
            <h3>Loading community safety feed...</h3>
            <p>Fetching real-time incident reports across Dhaka.</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="no-reports-card">
            <CheckCircle2 size={44} className="empty-check" />
            <h3>No reports match your filters</h3>
            <p>
              Try searching for a different landmark or clearing your category
              filters.
            </p>
            <button
              className="btn-reset-filters"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Categories");
                setSelectedThana("All Thanas");
                setSelectedStatus("all");
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredReports.map((report) => (
            <article className="report-card" key={report.id}>
              <div className="report-card-top">
                <div className="report-cat-wrap">
                  <span className="cat-tag">{report.category}</span>
                </div>

                <div className="time-tag">
                  <Clock size={12} />
                  <span>{report.time}</span>
                </div>
              </div>

              <h2
                className="report-heading"
                onClick={() => setActiveDetailModal(report)}
              >
                {report.title}
              </h2>

              <div className="report-author-meta">
                <span className="author-label">Reported by:</span>
                <span className="author-name">
                  {report.reporterName || "Citizen Reporter"}
                </span>
              </div>

              <div className="report-location-badge">
                <MapPin size={13} className="loc-pin" />
                <span>{report.location}</span>
                <span className="thana-label">{report.thana}</span>
              </div>

              <p className="report-desc-preview">{report.description}</p>

              <div className="report-card-footer">
                <div className="verification-controls">
                  <button
                    className={`btn-vote ${report.userVoted === "up" ? "active" : ""}`}
                    onClick={() => handleVote(report.id)}
                    title="Confirm incident is happening"
                  >
                    <ThumbsUp size={14} />
                    <span>Confirm ({report.upvotes})</span>
                  </button>
                </div>

                <div className="report-meta-actions">
                  <button
                    className="btn-comment-count"
                    onClick={() => setActiveDetailModal(report)}
                  >
                    <MessageSquare size={14} />
                    <span>{report.comments?.length || 0} updates</span>
                  </button>

                  <Link
                    to="/map"
                    className="btn-map-shortcut"
                    state={{
                      from: "report",
                      thana: report.thana,
                      title: report.title,
                      category: report.category,
                      location: report.location,
                      severity: report.severity,
                    }}
                  >
                    <span>Map</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* DETAIL & COMMENTS MODAL */}
      {activeDetailModal && (
        <ReportDetailModal
          report={activeDetailModal}
          onClose={() => setActiveDetailModal(null)}
          onToast={showToast}
        />
      )}
    </div>
  );
}

export default Reports;
