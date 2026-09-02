import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Bookmark,
  Building2,
  Clock,
  GraduationCap,
  Home,
  MapPin,
  Navigation,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import "./SavedAreas.css";
import { useReports } from "../context/ReportsContext";
import { useSavedAreas } from "../context/SavedAreasContext";

const thanaList = [
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
  "Wari"
];

function SavedAreas() {
  const { reports } = useReports();
  const { savedAreas, setSavedAreas } = useSavedAreas();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Form State
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("residential");
  const [formThana, setFormThana] = useState("Dhanmondi");
  const [formAddress, setFormAddress] = useState("");

  const recentAlerts = useMemo(() => {
    return reports
      .filter((report) => {
        // filter out anything older than 3 days
        const timeStr = report.time || "";
        const daysMatch = timeStr.match(/(\d+)\s*days?/i);
        if (daysMatch) {
          const days = parseInt(daysMatch[1], 10);
          if (days > 3) return false;
        }
        if (timeStr.toLowerCase().includes("week") || timeStr.toLowerCase().includes("month") || timeStr.toLowerCase().includes("year")) {
           return false;
        }
        return true;
      })
      .map((report) => {
        const area = savedAreas.find(({ thana }) => thana === report.thana);
        return area && { ...report, areaName: area.name, timeTag: report.time };
      })
      .filter(Boolean);
  }, [reports, savedAreas]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleDeleteArea = (id, name) => {
    setSavedAreas((prev) => prev.filter((area) => area.id !== id));
    showToast(`Removed "${name}" from saved areas`);
  };

  const handleCreateArea = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formAddress.trim()) {
      showToast("Please provide a name and address for your saved area.");
      return;
    }

    const newArea = {
      id: `area-${Date.now()}`,
      name: formName.trim(),
      category: formCategory,
      thana: formThana,
      address: formAddress.trim(),
      safetyScore: Math.floor(Math.random() * 15) + 82,
      recentStatus: "Area added. No new safety alerts in the last 24 hours.",
      position: [23.8103, 90.4125],
    };

    setSavedAreas([newArea, ...savedAreas]);
    setIsAddModalOpen(false);
    setFormName("");
    setFormAddress("");
    showToast(`Added "${newArea.name}" to your saved areas!`);
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case "residential":
        return <Home size={18} />;
      case "work":
        return <Building2 size={18} />;
      case "campus":
        return <GraduationCap size={18} />;
      default:
        return <Bookmark size={18} />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return "#22c55e";
    if (score >= 70) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="saved-areas-page">
      {/* TOAST POPUP */}
      {toastMessage && (
        <div className="saved-toast">
          <Sparkles size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER */}
      <header className="saved-header">
        <div>
          <div className="saved-badge">
            <Bookmark size={14} />
            <span>SAVED LOCATIONS & ALERTS</span>
          </div>
          <h1>Saved Areas</h1>
          <p>
            Safety overview and recent incident alerts for your saved locations
            across Dhaka from the last 3 days.
          </p>
        </div>

        <button
          className="btn-add-zone"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} />
          <span>Add Saved Location</span>
        </button>
      </header>

      {/* SUMMARY BANNER */}
      <div className="saved-summary-card">
        <div className="summary-item">
          <span className="summary-title">Saved Places</span>
          <strong>{savedAreas.length} Locations</strong>
          <small>Monitored for neighborhood alerts</small>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-item">
          <span className="summary-title">Recent Alerts (Last 3 Days)</span>
          <strong style={{ color: recentAlerts.length > 0 ? "#f59e0b" : "#22c55e" }}>
            {recentAlerts.length} Reported
          </strong>
          <small>Incidents near your saved places</small>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-item">
          <span className="summary-title">Average Safety Index</span>
          <strong style={{ color: "#22c55e" }}>
            {Math.round(
              savedAreas.reduce((acc, curr) => acc + curr.safetyScore, 0) /
                (savedAreas.length || 1)
            )}
            /100
          </strong>
          <small>Overall neighborhood security</small>
        </div>
      </div>

      {/* RECENT ALERTS IN SAVED AREAS (LAST 3 DAYS) */}
      <section className="saved-alerts-section">
        <div className="section-title-row">
          <div>
            <h2>Recent Alerts in Saved Areas (Last 3 Days)</h2>
            <p>
              Incidents, road hazards, and community notices reported around your
              saved locations.
            </p>
          </div>
          <span className="alert-count-pill">
            {recentAlerts.length} Recent Alerts
          </span>
        </div>

        {recentAlerts.length === 0 ? (
          <div className="alerts-empty-safe-card">
            <ShieldCheck size={20} className="safe-icon" />
            <span>
              All your saved areas are clear. No incidents reported in the last 3 days.
            </span>
          </div>
        ) : (
          <div className="saved-alerts-grid horizontal-scroll">
            {recentAlerts.map((alert) => (
              <div
                className={`saved-alert-card ${alert.severity}`}
                key={alert.id}
              >
                <div className="saved-alert-top">
                  <div className="alert-badge-group">
                    <span className="alert-cat-tag">{alert.category}</span>
                    <span className="alert-location-tag">
                      <MapPin size={12} />
                      {alert.areaName} ({alert.thana})
                    </span>
                  </div>

                  <div className="alert-time-tag">
                    <Clock size={12} />
                    <span>{alert.timeTag}</span>
                  </div>
                </div>

                <div className="saved-alert-body">
                  <h3>{alert.title}</h3>
                  <p>{alert.description}</p>
                </div>

                <div className="saved-alert-footer">
                  <div className="alert-status-indicator">
                    {alert.severity === "resolved" ? (
                      <span className="status-resolved">
                        <ShieldCheck size={13} />
                        Resolved
                      </span>
                    ) : (
                      <span className="status-caution">
                        <AlertTriangle size={13} />
                        Recent Notice
                      </span>
                    )}
                  </div>

                  <Link
                    to="/map"
                    className="btn-alert-map"
                    state={{
                      from: "alert",
                      thana: alert.thana,
                      title: alert.title,
                      category: alert.category,
                      areaName: alert.areaName,
                      severity: alert.severity,
                    }}
                  >
                    <Navigation size={13} />
                    <span>View on Live Map</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SAVED LOCATIONS GRID */}
      <section className="saved-locations-section">
        <div className="section-title-row">
          <div>
            <h2>Your Saved Locations</h2>
            <p>Manage your home, workplace, and regular destinations.</p>
          </div>
          <span className="count-pill">{savedAreas.length} Saved</span>
        </div>

        <div className="saved-locations-grid">
          {savedAreas.map((area) => {
            const scoreColor = getScoreColor(area.safetyScore);
            return (
              <div className="saved-location-card" key={area.id}>
                <div className="location-card-top">
                  <div className={`location-cat-icon ${area.category}`}>
                    {getCategoryIcon(area.category)}
                  </div>

                  <div className="location-meta">
                    <h3>{area.name}</h3>
                    <span className="location-thana-badge">
                      <MapPin size={12} />
                      {area.thana}
                    </span>
                  </div>
                </div>

                <div className="location-address">
                  <span>{area.address}</span>
                </div>

                {/* SAFETY SCORE BAR */}
                <div className="safety-score-wrap">
                  <div className="score-header">
                    <span>Neighborhood Safety Index</span>
                    <strong style={{ color: scoreColor }}>
                      {area.safetyScore}/100
                    </strong>
                  </div>
                  <div className="score-track">
                    <div
                      className="score-fill"
                      style={{
                        width: `${area.safetyScore}%`,
                        background: scoreColor,
                      }}
                    ></div>
                  </div>
                </div>

                {/* RECENT STATUS */}
                <div className="location-status-note">
                  <ShieldCheck size={15} className="hazard-safe-icon" />
                  <p>{area.recentStatus}</p>
                </div>

                <div className="location-card-actions">
                  <Link
                    to="/map"
                    className="btn-location-map"
                    state={{
                      from: "location",
                      thana: area.thana,
                      name: area.name,
                      address: area.address,
                      category: area.category,
                      safetyScore: area.safetyScore,
                    }}
                  >
                    <Navigation size={13} />
                    <span>View on Map</span>
                  </Link>

                  <button
                    className="btn-location-delete"
                    onClick={() => handleDeleteArea(area.id, area.name)}
                    title="Delete Saved Location"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ADD SAVED LOCATION MODAL */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <div className="modal-title-group">
                <Bookmark size={20} />
                <h3>Add New Saved Location</h3>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setIsAddModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateArea} className="modal-form">
              <div className="form-group">
                <label>Location Name / Label</label>
                <input
                  type="text"
                  placeholder="e.g. Home, Office, Sister's College, Gym"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                  >
                    <option value="residential">Residential / Home</option>
                    <option value="work">Workplace / Office</option>
                    <option value="campus">University / Campus</option>
                    <option value="family">Family & Relatives</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Dhaka Thana</label>
                  <select
                    value={formThana}
                    onChange={(e) => setFormThana(e.target.value)}
                  >
                    {thanaList.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Street Address / Area Landmark</label>
                <input
                  type="text"
                  placeholder="e.g. House 14, Road 27, Dhanmondi"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit">
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SavedAreas;
