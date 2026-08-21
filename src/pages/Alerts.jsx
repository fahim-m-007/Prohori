import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Bell,
  BellRing,
  CheckCircle2,
  ChevronRight,
  Clock,
  Filter,
  Flame,
  Info,
  MapPin,
  Megaphone,
  Radio,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import "./Alerts.css";

const initialAlerts = [
  {
    id: "alt-1",
    severity: "high",
    title: "Armed Snatching & Robbery Incident",
    category: "Crime & Safety",
    thana: "Mohammadpur",
    location: "Near Beribadh Embankment, Mohammadpur",
    time: "8 mins ago",
    timestamp: "3:02 PM",
    description:
      "Multiple citizens reported motorcycle gang targeting pedestrians and rickshaws near the embankment road. DMP patrol team has been alerted.",
    verifiedCount: 28,
    isRead: false,
    checkedInSafe: false,
    advice: "Avoid dimly lit embankment alleys. Travel in groups or take Main Ring Road.",
  },
  {
    id: "alt-2",
    severity: "caution",
    title: "Severe Waterlogging & Open Manhole Warning",
    category: "Civic Hazard",
    thana: "Mirpur",
    location: "Mirpur 10 to Kazipara Main Road",
    time: "24 mins ago",
    timestamp: "2:46 PM",
    description:
      "Heavy rainwater accumulation up to knee level following afternoon cloudburst. Two manhole lids dislodged near metro pillar 241.",
    verifiedCount: 42,
    isRead: false,
    checkedInSafe: false,
    advice: "Vehicles with low clearance should take alternative routes via Shewrapara inner lane.",
  },
  {
    id: "alt-3",
    severity: "high",
    title: "Electrical Transformer Fire & Smoke Hazard",
    category: "Fire Emergency",
    thana: "Dhanmondi",
    location: "Road 27 Intersection, Dhanmondi",
    time: "42 mins ago",
    timestamp: "2:28 PM",
    description:
      "DPDC transformer blast caused thick electrical smoke and power outage across Block A. Fire service engine on site.",
    verifiedCount: 19,
    isRead: false,
    checkedInSafe: false,
    advice: "Keep windows closed in nearby residential buildings. Traffic diverted through Satmasjid Road.",
  },
  {
    id: "alt-4",
    severity: "advisory",
    title: "VIP Convoy & Traffic Gridlock",
    category: "Traffic Advisory",
    thana: "Gulshan",
    location: "Gulshan 1 Circle towards Mohakhali Flyover",
    time: "1 hour ago",
    timestamp: "2:05 PM",
    description:
      "Severe standstill traffic due to official diplomatic delegation movement. Expected clearance in 45 minutes.",
    verifiedCount: 15,
    isRead: true,
    checkedInSafe: false,
    advice: "Commuters heading to Airport are advised to use Hatirjheel expressway link.",
  },
  {
    id: "alt-5",
    severity: "caution",
    title: "Broken Streetlights & Harassment Hotspot",
    category: "Public Safety",
    thana: "Uttara",
    location: "Sector 11 Lake Walkway & Footbridge",
    time: "2 hours ago",
    timestamp: "1:15 PM",
    description:
      "Continuous stretch of 12 street lamps completely non-functional. Women commuters reported verbal harassment past dusk.",
    verifiedCount: 31,
    isRead: true,
    checkedInSafe: false,
    advice: "Use main Avenue 1 instead of pedestrian lakeside path after 6:30 PM.",
  },
  {
    id: "alt-6",
    severity: "advisory",
    title: "WASA Pipeline Emergency Excavation",
    category: "Civic Issue",
    thana: "Old Dhaka",
    location: "Nazimuddin Road, Lalbagh",
    time: "3 hours ago",
    timestamp: "12:10 PM",
    description:
      "One lane blocked for drinking water main pipeline replacement work. Rickshaws and small vehicles only.",
    verifiedCount: 8,
    isRead: true,
    checkedInSafe: false,
    advice: "Trucks and buses must divert via Bakshibazar road.",
  },
];

const thanaOptions = [
  "All Dhaka",
  "Dhanmondi",
  "Gulshan",
  "Mirpur",
  "Mohammadpur",
  "Uttara",
  "Old Dhaka",
  "Banani",
];

function Alerts() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [activeSeverity, setActiveSeverity] = useState("all");
  const [selectedThana, setSelectedThana] = useState("All Dhaka");
  const [notifySubscribed, setNotifySubscribed] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [broadcastDismissed, setBroadcastDismissed] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleToggleSafe = (id) => {
    setAlerts((prev) =>
      prev.map((alert) => {
        if (alert.id === id) {
          const newState = !alert.checkedInSafe;
          if (newState) {
            showToast("Marked as Safe! Your emergency status has been logged.");
          }
          return { ...alert, checkedInSafe: newState };
        }
        return alert;
      })
    );
  };

  const handleMarkAsRead = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
    );
  };

  const handleShare = (alert) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `[PROHORI DHAKA ALERT] ${alert.title} at ${alert.location}. Verified advice: ${alert.advice}`
      );
    }
    showToast("Alert summary copied to clipboard! You can share it anywhere.");
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSeverity =
      activeSeverity === "all" || alert.severity === activeSeverity;
    const matchesThana =
      selectedThana === "All Dhaka" || alert.thana === selectedThana;
    return matchesSeverity && matchesThana;
  });

  const highRiskCount = alerts.filter((a) => a.severity === "high").length;
  const cautionCount = alerts.filter((a) => a.severity === "caution").length;
  const advisoryCount = alerts.filter((a) => a.severity === "advisory").length;
  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return (
    <div className="alerts-page">
      {/* TOAST POPUP */}
      {toastMessage && (
        <div className="alert-toast">
          <Sparkles size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER */}
      <header className="alerts-header">
        <div>
          <div className="alerts-badge">
            <Radio size={14} className="pulse-icon" />
            <span>REAL-TIME SAFETY RADAR</span>
          </div>
          <h1>Dhaka City Safety Alerts</h1>
          <p>
            Instant crowdsourced warnings, verified hazards, and urgent civic
            notices across Dhaka metropolitan area.
          </p>
        </div>

        <div className="alerts-header-actions">
          <button
            className={`subscribe-toggle ${notifySubscribed ? "active" : ""}`}
            onClick={() => {
              setNotifySubscribed(!notifySubscribed);
              showToast(
                !notifySubscribed
                  ? "Instant Web Alerts Enabled for Dhaka"
                  : "Web Alerts Muted"
              );
            }}
          >
            {notifySubscribed ? <BellRing size={16} /> : <Bell size={16} />}
            <span>{notifySubscribed ? "Alerts Active" : "Muted"}</span>
          </button>
        </div>
      </header>

      {/* EMERGENCY BROADCAST BANNER */}
      {!broadcastDismissed && (
        <div className="emergency-broadcast-banner">
          <div className="broadcast-icon">
            <Megaphone size={22} />
          </div>
          <div className="broadcast-content">
            <div className="broadcast-tag">CITY-WIDE EMERGENCY BROADCAST</div>
            <h3>Heavy Monsoon Cloudburst Advisory for Western Dhaka</h3>
            <p>
              Dhaka North City Corporation (DNCC) has deployed pump stations at
              Mirpur 10, Kazipara, and Gabtoli. Please exercise caution near
              electric poles and open storm drains.
            </p>
          </div>
          <button
            className="dismiss-broadcast-btn"
            onClick={() => setBroadcastDismissed(true)}
            aria-label="Dismiss broadcast"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* METRICS ROW */}
      <div className="alerts-metrics-grid">
        <div
          className={`metric-card high-risk ${
            activeSeverity === "high" ? "active" : ""
          }`}
          onClick={() =>
            setActiveSeverity(activeSeverity === "high" ? "all" : "high")
          }
        >
          <div className="metric-icon">
            <Flame size={20} />
          </div>
          <div className="metric-info">
            <span className="metric-label">High Risk (Red)</span>
            <strong className="metric-number">{highRiskCount}</strong>
            <small>Requires immediate attention</small>
          </div>
        </div>

        <div
          className={`metric-card caution ${
            activeSeverity === "caution" ? "active" : ""
          }`}
          onClick={() =>
            setActiveSeverity(activeSeverity === "caution" ? "all" : "caution")
          }
        >
          <div className="metric-icon">
            <AlertTriangle size={20} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Caution Warnings</span>
            <strong className="metric-number">{cautionCount}</strong>
            <small>Active hazards & street issues</small>
          </div>
        </div>

        <div
          className={`metric-card advisory ${
            activeSeverity === "advisory" ? "active" : ""
          }`}
          onClick={() =>
            setActiveSeverity(
              activeSeverity === "advisory" ? "all" : "advisory"
            )
          }
        >
          <div className="metric-icon">
            <Info size={20} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Civic Advisories</span>
            <strong className="metric-number">{advisoryCount}</strong>
            <small>Traffic & municipal updates</small>
          </div>
        </div>

        <div className="metric-card unread">
          <div className="metric-icon">
            <ShieldCheck size={20} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Unread Alerts</span>
            <strong className="metric-number">{unreadCount}</strong>
            <small>Fresh reports in last 4 hours</small>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="alerts-controls-bar">
        <div className="severity-tabs">
          <button
            className={activeSeverity === "all" ? "active" : ""}
            onClick={() => setActiveSeverity("all")}
          >
            All Alerts ({alerts.length})
          </button>
          <button
            className={`tab-high ${activeSeverity === "high" ? "active" : ""}`}
            onClick={() => setActiveSeverity("high")}
          >
            High Risk ({highRiskCount})
          </button>
          <button
            className={`tab-caution ${
              activeSeverity === "caution" ? "active" : ""
            }`}
            onClick={() => setActiveSeverity("caution")}
          >
            Caution ({cautionCount})
          </button>
          <button
            className={`tab-advisory ${
              activeSeverity === "advisory" ? "active" : ""
            }`}
            onClick={() => setActiveSeverity("advisory")}
          >
            Advisory ({advisoryCount})
          </button>
        </div>

        <div className="thana-dropdown-wrap">
          <Filter size={15} />
          <select
            value={selectedThana}
            onChange={(e) => setSelectedThana(e.target.value)}
            className="thana-select-input"
          >
            {thanaOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ALERTS FEED */}
      <div className="alerts-feed-list">
        {filteredAlerts.length === 0 ? (
          <div className="empty-alerts-card">
            <ShieldCheck size={48} className="empty-icon" />
            <h3>No Active Alerts for this Filter</h3>
            <p>
              Great news! No critical incidents match your selected severity and
              location filter right now.
            </p>
            <button
              className="reset-filter-btn"
              onClick={() => {
                setActiveSeverity("all");
                setSelectedThana("All Dhaka");
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <article
              key={alert.id}
              className={`alert-item-card ${alert.severity} ${
                !alert.isRead ? "unread-card" : ""
              }`}
            >
              <div className="alert-card-side">
                <div className={`alert-severity-pill ${alert.severity}`}>
                  {alert.severity === "high" && <Flame size={14} />}
                  {alert.severity === "caution" && <AlertTriangle size={14} />}
                  {alert.severity === "advisory" && <Info size={14} />}
                  <span>
                    {alert.severity === "high"
                      ? "High Risk"
                      : alert.severity === "caution"
                      ? "Caution"
                      : "Advisory"}
                  </span>
                </div>
                {!alert.isRead && (
                  <span className="fresh-dot" title="New alert"></span>
                )}
              </div>

              <div className="alert-card-main">
                <div className="alert-card-header">
                  <div>
                    <span className="alert-category-tag">{alert.category}</span>
                    <h2 className="alert-title">{alert.title}</h2>
                  </div>

                  <div className="alert-time-badge">
                    <Clock size={13} />
                    <span>{alert.time}</span>
                  </div>
                </div>

                <div className="alert-location-row">
                  <MapPin size={14} className="location-pin-icon" />
                  <strong>{alert.location}</strong>
                  <span className="thana-pill">{alert.thana}</span>
                </div>

                <p className="alert-description">{alert.description}</p>

                {alert.advice && (
                  <div className="alert-advice-box">
                    <strong>
                      <ShieldAlert size={14} /> Safety Advice:
                    </strong>
                    <span>{alert.advice}</span>
                  </div>
                )}

                <div className="alert-card-footer">
                  <div className="verification-stat">
                    <CheckCircle2 size={15} />
                    <span>
                      <strong>{alert.verifiedCount} citizens</strong> confirmed
                      this
                    </span>
                  </div>

                  <div className="alert-actions-group">
                    <button
                      className={`btn-im-safe ${
                        alert.checkedInSafe ? "safe-confirmed" : ""
                      }`}
                      onClick={() => handleToggleSafe(alert.id)}
                    >
                      <ShieldCheck size={14} />
                      <span>
                        {alert.checkedInSafe
                          ? "Marked as Safe"
                          : "I'm in this Area (Check-in)"}
                      </span>
                    </button>

                    <button
                      className="btn-share-alert"
                      onClick={() => handleShare(alert)}
                      title="Share Alert"
                    >
                      <Share2 size={14} />
                      <span>Share</span>
                    </button>

                    <Link
                      to="/map"
                      className="btn-view-map"
                      onClick={() => handleMarkAsRead(alert.id)}
                    >
                      <span>View Map</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default Alerts;
