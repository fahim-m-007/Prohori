import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Flag,
  MapPin,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  ThumbsUp,
  X,
} from "lucide-react";
import "./Reports.css";

const initialReportsList = [
  {
    id: "rep-1",
    title: "Major road accident involving two buses",
    category: "Road accident",
    severity: "high",
    thana: "Dhanmondi",
    location: "Satmasjid Road, near Dhanmondi 27 intersection",
    time: "12 min ago",
    timestamp: "2:55 PM",
    description:
      "A collision between two passenger buses has severely blocked southbound traffic. Police and ambulance on scene. Expect 30+ min delay.",
    upvotes: 28,
    userVoted: null,
    flagged: false,
    status: "verified",
    comments: [
      { author: "Tanvir H.", time: "8m ago", text: "Satmasjid road is locked. Take Road 8A instead." },
      { author: "Nusrat J.", time: "3m ago", text: "Ambulance just arrived, clearing one lane." },
    ],
  },
  {
    id: "rep-2",
    title: "Heavy knee-level waterlogging & sewer backup",
    category: "Waterlogging",
    severity: "caution",
    thana: "Mirpur",
    location: "Mirpur 10 roundabout to Kazipara",
    time: "24 min ago",
    timestamp: "2:43 PM",
    description:
      "Water accumulation over 1.5 feet deep. Multiple CNGs and motorbikes stalled in the middle of the road. Open manhole flagged with red flag.",
    upvotes: 45,
    userVoted: null,
    flagged: false,
    status: "verified",
    comments: [
      { author: "Shakil A.", time: "15m ago", text: "Avoid Mirpur 10 circle completely if driving sedan." },
    ],
  },
  {
    id: "rep-3",
    title: "Severe traffic disruption & standstill gridlock",
    category: "Traffic disruption",
    severity: "caution",
    thana: "Shahbagh",
    location: "Shahbagh Intersection towards TSC",
    time: "41 min ago",
    timestamp: "2:15 PM",
    description:
      "Heavy congestion causing vehicular gridlock towards TSC and Bangla Motor. Diversions active via High Court road.",
    upvotes: 38,
    userVoted: null,
    flagged: false,
    status: "verified",
    comments: [],
  },
  {
    id: "rep-4",
    title: "Theft & attempted motorbike bag snatching",
    category: "Theft",
    severity: "high",
    thana: "Mohammadpur",
    location: "Beribadh Embankment Footbridge",
    time: "48 min ago",
    timestamp: "2:08 PM",
    description:
      "Two men on a dark red pulsar bike attempted to snatch a bag from a rickshaw commuter. Neighborhood volunteers chased them away.",
    upvotes: 52,
    userVoted: null,
    flagged: false,
    status: "verified",
    comments: [
      { author: "Ahsan K.", time: "30m ago", text: "Volunteers are now stationed at the footbridge corner." },
    ],
  },
  {
    id: "rep-5",
    title: "Faulty electrical transformer sparking hazard",
    category: "Other",
    severity: "caution",
    thana: "Gulshan",
    location: "Road 103, Gulshan 2",
    time: "1 hr ago",
    timestamp: "1:45 PM",
    description:
      "Sparks dropping over parked cars. DESCO helpline contacted and team dispatched. Area temporarily cordoned off with yellow tape.",
    upvotes: 19,
    userVoted: null,
    flagged: false,
    status: "verified",
    comments: [],
  },
];

const categories = [
  "All Categories",
  "Road accident",
  "Waterlogging",
  "Traffic disruption",
  "Theft",
  "Other",
];

const thanas = [
  "All Thanas",
  "Dhanmondi",
  "Mirpur",
  "Mohammadpur",
  "Gulshan",
  "Uttara",
  "Shahbagh",
  "Old Dhaka",
];

function Reports() {
  const [reports, setReports] = useState(initialReportsList);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedThana, setSelectedThana] = useState("All Thanas");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [activeDetailModal, setActiveDetailModal] = useState(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleVote = (id, type) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          if (r.userVoted === type) {
            return {
              ...r,
              upvotes: type === "up" ? r.upvotes - 1 : r.upvotes,
              userVoted: null,
            };
          } else {
            const upDelta =
              type === "up"
                ? r.userVoted === "down"
                  ? 1
                  : 1
                : r.userVoted === "up"
                ? -1
                : 0;
            showToast(
              type === "up"
                ? "Confirmed incident! Thank you for verifying."
                : "Feedback recorded."
            );
            return {
              ...r,
              upvotes: r.upvotes + upDelta,
              userVoted: type,
            };
          }
        }
        return r;
      })
    );
  };

  const handleFlag = (id) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          showToast("Report flagged for moderator review.");
          return { ...r, flagged: !r.flagged };
        }
        return r;
      })
    );
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeDetailModal) return;

    const newComment = {
      author: "Fahim (You)",
      time: "Just now",
      text: newCommentText.trim(),
    };

    setReports((prev) =>
      prev.map((r) =>
        r.id === activeDetailModal.id
          ? { ...r, comments: [...r.comments, newComment] }
          : r
      )
    );

    setActiveDetailModal((prev) => ({
      ...prev,
      comments: [...prev.comments, newComment],
    }));

    setNewCommentText("");
    showToast("Your update was posted to the community feed!");
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
  }, [reports, searchQuery, selectedCategory, selectedThana, selectedStatus, sortBy]);

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
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Most Recent</option>
              <option value="upvotes">Most Confirmed</option>
            </select>
          </div>
        </div>
      </div>

      {/* FEED METRICS */}
      <div className="reports-feed-count">
        <span>Showing {filteredReports.length} results</span>
      </div>

      {/* REPORTS LIST */}
      <div className="reports-cards-grid">
        {filteredReports.length === 0 ? (
          <div className="no-reports-card">
            <CheckCircle2 size={44} className="empty-check" />
            <h3>No reports match your filters</h3>
            <p>Try searching for a different landmark or clearing your category filters.</p>
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
                    onClick={() => handleVote(report.id, "up")}
                    title="Confirm incident is happening"
                  >
                    <ThumbsUp size={14} />
                    <span>Confirm ({report.upvotes})</span>
                  </button>

                  <button
                    className={`btn-flag ${report.flagged ? "flagged" : ""}`}
                    onClick={() => handleFlag(report.id)}
                    title="Flag report as inaccurate"
                  >
                    <Flag size={14} />
                  </button>
                </div>

                <div className="report-meta-actions">
                  <button
                    className="btn-comment-count"
                    onClick={() => setActiveDetailModal(report)}
                  >
                    <MessageSquare size={14} />
                    <span>{report.comments.length} updates</span>
                  </button>

                  <Link to="/map" className="btn-map-shortcut">
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
        <div className="modal-overlay">
          <div className="modal-dialog report-detail-modal">
            <div className="modal-header">
              <div>
                <span className="cat-tag">{activeDetailModal.category}</span>
                <h3 className="modal-report-title">{activeDetailModal.title}</h3>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setActiveDetailModal(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-location-strip">
              <MapPin size={14} />
              <strong>{activeDetailModal.location}</strong>
              <span>({activeDetailModal.thana} Thana)</span>
              <span className="modal-time">· Reported {activeDetailModal.time}</span>
            </div>

            <p className="modal-full-desc">{activeDetailModal.description}</p>

            <div className="modal-confirmations-strip">
              <CheckCircle2 size={16} />
              <span>
                <strong>{activeDetailModal.upvotes} citizens</strong> have
                confirmed this incident live on ground.
              </span>
            </div>

            {/* LIVE UPDATES / COMMENTS */}
            <div className="modal-comments-section">
              <h4>Community Updates & On-ground Notes ({activeDetailModal.comments.length})</h4>

              <div className="comments-feed-box">
                {activeDetailModal.comments.length === 0 ? (
                  <p className="no-comments-msg">
                    No live updates yet. Are you near this area? Post a situation update below.
                  </p>
                ) : (
                  activeDetailModal.comments.map((c, idx) => (
                    <div className="single-comment-item" key={idx}>
                      <div className="comment-author-line">
                        <strong>{c.author}</strong>
                        <small>{c.time}</small>
                      </div>
                      <p>{c.text}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleAddComment} className="comment-input-form">
                <input
                  type="text"
                  placeholder="Add a live update (e.g. 'Road cleared', 'Water receding')..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  required
                />
                <button type="submit" className="btn-send-update">
                  Post Update
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;
