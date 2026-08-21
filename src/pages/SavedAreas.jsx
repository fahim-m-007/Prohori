import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Bell,
  BellOff,
  Bookmark,
  Building2,
  GraduationCap,
  Home,
  MapPin,
  Navigation,
  Plus,
  Radio,
  Route,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import "./SavedAreas.css";

const defaultSavedAreas = [
  {
    id: "zone-1",
    name: "Home",
    category: "residential",
    thana: "Dhanmondi",
    address: "Road 9/A, Dhanmondi R/A",
    radius: "1 km",
    safetyScore: 92,
    activeIncidents: 0,
    recentHazard: "Road 27 transformer repaired. All streets well lit.",
    notificationsEnabled: true,
    monitoredRisks: ["Crime & Snatching", "Waterlogging", "Night Harassment"],
  },
  {
    id: "zone-2",
    name: "Tech Office",
    category: "work",
    thana: "Gulshan",
    address: "Gulshan Avenue, Gulshan 2 Circle",
    radius: "500 m",
    safetyScore: 84,
    activeIncidents: 1,
    recentHazard: "VIP motorcade traffic slowdown near DCC market.",
    notificationsEnabled: true,
    monitoredRisks: ["Traffic Gridlock", "Public Safety"],
  },
  {
    id: "zone-3",
    name: "Dhaka University Campus",
    category: "campus",
    thana: "Shahbagh",
    address: "Curzon Hall & TSC Area",
    radius: "2 km",
    safetyScore: 78,
    activeIncidents: 2,
    recentHazard: "Gathering near Shahbagh intersection; detour recommended.",
    notificationsEnabled: false,
    monitoredRisks: ["Public Safety", "Night Harassment", "Crime & Snatching"],
  },
  {
    id: "zone-4",
    name: "Parents' Residence",
    category: "family",
    thana: "Uttara",
    address: "Sector 4, Road 11, Uttara",
    radius: "1.5 km",
    safetyScore: 88,
    activeIncidents: 0,
    recentHazard: "No active incidents in the last 24 hours.",
    notificationsEnabled: true,
    monitoredRisks: ["Waterlogging", "Crime & Snatching", "Fire Hazards"],
  },
];

const defaultCommuteRoutes = [
  {
    id: "route-1",
    name: "Daily Work Commute",
    origin: "Dhanmondi 9/A",
    destination: "Gulshan 2",
    preferredVia: "Hatirjheel Expressway Link",
    status: "safe",
    incidentCount: 1,
    statusNote: "Hatirjheel route clear. Slight slowdown approaching Police Plaza.",
  },
  {
    id: "route-2",
    name: "Evening University Route",
    origin: "TSC, Dhaka University",
    destination: "Dhanmondi 27",
    preferredVia: "Science Lab -> Mirpur Road",
    status: "caution",
    incidentCount: 2,
    statusNote: "Waterlogging reported near Kalabagan bus stand. Proceed with caution.",
  },
];

const thanaList = [
  "Dhanmondi",
  "Gulshan",
  "Banani",
  "Mirpur",
  "Uttara",
  "Mohammadpur",
  "Shahbagh",
  "Motijheel",
  "Badda",
  "Old Dhaka",
];

function SavedAreas() {
  const [savedAreas, setSavedAreas] = useState(defaultSavedAreas);
  const [commuteRoutes] = useState(defaultCommuteRoutes);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Form State
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("residential");
  const [formThana, setFormThana] = useState("Dhanmondi");
  const [formAddress, setFormAddress] = useState("");
  const [formRadius, setFormRadius] = useState("1 km");
  const [formRisks, setFormRisks] = useState(["Crime & Snatching", "Waterlogging"]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const toggleNotification = (id) => {
    setSavedAreas((prev) =>
      prev.map((zone) => {
        if (zone.id === id) {
          const next = !zone.notificationsEnabled;
          showToast(
            next
              ? `Radar alerts activated for ${zone.name}`
              : `Alerts muted for ${zone.name}`
          );
          return { ...zone, notificationsEnabled: next };
        }
        return zone;
      })
    );
  };

  const handleDeleteArea = (id, name) => {
    setSavedAreas((prev) => prev.filter((zone) => zone.id !== id));
    showToast(`Removed "${name}" from watchzones`);
  };

  const handleToggleRiskCheckbox = (risk) => {
    setFormRisks((prev) =>
      prev.includes(risk) ? prev.filter((r) => r !== risk) : [...prev, risk]
    );
  };

  const handleCreateArea = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formAddress.trim()) {
      showToast("Please provide a name and address for your safety watchzone.");
      return;
    }

    const newZone = {
      id: `zone-${Date.now()}`,
      name: formName,
      category: formCategory,
      thana: formThana,
      address: formAddress,
      radius: formRadius,
      safetyScore: Math.floor(Math.random() * 15) + 82,
      activeIncidents: 0,
      recentHazard: "Watchzone activated. Safety monitoring is live.",
      notificationsEnabled: true,
      monitoredRisks: formRisks,
    };

    setSavedAreas([newZone, ...savedAreas]);
    setIsAddModalOpen(false);
    setFormName("");
    setFormAddress("");
    showToast(`Added "${formName}" to your active safety watchzones!`);
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
            <Radio size={14} className="pulse-radar-icon" />
            <span>PERSONAL GEOFENCE MONITOR</span>
          </div>
          <h1>Saved Areas & Watchzones</h1>
          <p>
            Monitor high-priority locations in Dhaka for instant alerts, live
            safety scores, and commute safety forecasts.
          </p>
        </div>

        <button
          className="btn-add-zone"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} />
          <span>Add Safety Watchzone</span>
        </button>
      </header>

      {/* SUMMARY BANNER */}
      <div className="saved-summary-card">
        <div className="summary-item">
          <span className="summary-title">Active Watchzones</span>
          <strong>{savedAreas.length} Locations</strong>
          <small>Monitored 24/7 across Dhaka</small>
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
          <small>High overall neighborhood security</small>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-item">
          <span className="summary-title">Nearby Hazards</span>
          <strong style={{ color: "#f59e0b" }}>
            {savedAreas.reduce((acc, curr) => acc + curr.activeIncidents, 0)}{" "}
            Active
          </strong>
          <small>Verified in your selected zones</small>
        </div>
      </div>

      {/* SAVED WATCHZONES GRID */}
      <section className="watchzones-section">
        <div className="section-title-row">
          <h2>Monitored Safety Zones</h2>
          <span className="count-pill">{savedAreas.length} Saved</span>
        </div>

        <div className="watchzones-grid">
          {savedAreas.map((zone) => {
            const scoreColor = getScoreColor(zone.safetyScore);
            return (
              <div className="watchzone-card" key={zone.id}>
                <div className="watchzone-top">
                  <div className={`zone-cat-icon ${zone.category}`}>
                    {getCategoryIcon(zone.category)}
                  </div>

                  <div className="zone-meta">
                    <h3>{zone.name}</h3>
                    <span className="zone-thana-badge">
                      <MapPin size={12} />
                      {zone.thana} · {zone.radius} radius
                    </span>
                  </div>

                  <button
                    className={`btn-notify-toggle ${
                      zone.notificationsEnabled ? "active" : ""
                    }`}
                    onClick={() => toggleNotification(zone.id)}
                    title={
                      zone.notificationsEnabled
                        ? "Mute Alerts"
                        : "Enable Alerts"
                    }
                  >
                    {zone.notificationsEnabled ? (
                      <Bell size={15} />
                    ) : (
                      <BellOff size={15} />
                    )}
                  </button>
                </div>

                <div className="zone-address">
                  <span>{zone.address}</span>
                </div>

                {/* SAFETY SCORE BAR */}
                <div className="safety-score-wrap">
                  <div className="score-header">
                    <span>Neighborhood Safety Index</span>
                    <strong style={{ color: scoreColor }}>
                      {zone.safetyScore}/100
                    </strong>
                  </div>
                  <div className="score-track">
                    <div
                      className="score-fill"
                      style={{
                        width: `${zone.safetyScore}%`,
                        background: scoreColor,
                      }}
                    ></div>
                  </div>
                </div>

                {/* RECENT STATUS */}
                <div className="zone-hazard-note">
                  {zone.activeIncidents > 0 ? (
                    <AlertTriangle size={15} className="hazard-warn-icon" />
                  ) : (
                    <ShieldCheck size={15} className="hazard-safe-icon" />
                  )}
                  <p>{zone.recentHazard}</p>
                </div>

                {/* MONITORED RISKS TAGS */}
                <div className="zone-risks-chips">
                  {zone.monitoredRisks.map((risk) => (
                    <span key={risk} className="risk-chip">
                      {risk}
                    </span>
                  ))}
                </div>

                <div className="zone-card-actions">
                  <Link to="/map" className="btn-zone-map">
                    <Navigation size={13} />
                    <span>View on Live Map</span>
                  </Link>

                  <button
                    className="btn-zone-delete"
                    onClick={() => handleDeleteArea(zone.id, zone.name)}
                    title="Delete Watchzone"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* COMMUTE CORRIDORS SECTION */}
      <section className="commute-section">
        <div className="section-title-row">
          <div>
            <h2>Daily Commute Corridors</h2>
            <p>
              Pre-monitored routes across Dhaka. Check road hazards before
              stepping out.
            </p>
          </div>
        </div>

        <div className="commute-cards-list">
          {commuteRoutes.map((route) => (
            <div className="commute-card" key={route.id}>
              <div className="commute-icon-wrap">
                <Route size={22} />
              </div>

              <div className="commute-details">
                <div className="commute-header-line">
                  <h3>{route.name}</h3>
                  <span className={`commute-status-pill ${route.status}`}>
                    {route.status === "safe" ? "Route Clear" : "Caution on Path"}
                  </span>
                </div>

                <div className="commute-path">
                  <strong>{route.origin}</strong>
                  <span className="arrow-sep">→</span>
                  <strong>{route.destination}</strong>
                  <span className="via-label">(via {route.preferredVia})</span>
                </div>

                <p className="commute-note">{route.statusNote}</p>
              </div>

              <Link to="/map" className="btn-commute-inspect">
                Inspect Route
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ADD WATCHZONE MODAL */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <div className="modal-title-group">
                <Bookmark size={20} />
                <h3>Add New Dhaka Watchzone</h3>
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
                <label>Watchzone Label</label>
                <input
                  type="text"
                  placeholder="e.g. My Apartment, Coaching Center, Sister's College"
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
                    <option value="campus">University / School</option>
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
                <label>Specific Landmark / Street Address</label>
                <input
                  type="text"
                  placeholder="e.g. House 14, Road 27, Block A"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Geofence Alert Radius</label>
                <div className="radius-selector-tabs">
                  {["500 m", "1 km", "2 km", "5 km"].map((r) => (
                    <button
                      type="button"
                      key={r}
                      className={formRadius === r ? "active" : ""}
                      onClick={() => setFormRadius(r)}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Notify me about:</label>
                <div className="checkboxes-grid">
                  {[
                    "Crime & Snatching",
                    "Waterlogging",
                    "Night Harassment",
                    "Fire Hazards",
                    "Traffic Gridlock",
                  ].map((risk) => (
                    <label key={risk} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formRisks.includes(risk)}
                        onChange={() => handleToggleRiskCheckbox(risk)}
                      />
                      <span>{risk}</span>
                    </label>
                  ))}
                </div>
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
                  Save Watchzone
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
