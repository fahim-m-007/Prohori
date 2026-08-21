import { useState } from "react";
import {
  Bell,
  Lock,
  Map,
  Save,
  Shield,
  ShieldAlert,
  Sparkles,
  Trash2,
  User,
  Volume2,
} from "lucide-react";
import "./Settings.css";

function Settings() {
  const [activeTab, setActiveTab] = useState("notifications");
  const [toastMessage, setToastMessage] = useState("");

  // Form states
  const [displayName, setDisplayName] = useState("Fahim");
  const [email, setEmail] = useState("fahim@prohori.org");
  const [primaryThana, setPrimaryThana] = useState("Dhanmondi Thana");
  
  // Notification states
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsHighRisk, setSmsHighRisk] = useState(true);
  const [radiusKm, setRadiusKm] = useState(3);
  const [soundType, setSoundType] = useState("urgent");
  const [quietHours, setQuietHours] = useState(false);

  // Privacy states
  const [anonymousReporting, setAnonymousReporting] = useState(false);
  const [broadenLocation, setBroadenLocation] = useState(false);
  const [shareAggregatedData, setShareAggregatedData] = useState(true);

  // Map & Offline states
  const [mapStyle, setMapStyle] = useState("standard");
  const [offlineCached, setOfflineCached] = useState(true);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    showToast("Safety preferences saved successfully!");
  };

  return (
    <div className="settings-page">
      {/* TOAST */}
      {toastMessage && (
        <div className="settings-toast">
          <Sparkles size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER */}
      <header className="settings-header">
        <div>
          <div className="settings-badge">
            <Shield size={14} />
            <span>PREFERENCES & CONTROLS</span>
          </div>
          <h1>System Settings</h1>
          <p>
            Configure your Dhaka safety alerts, privacy anonymity, geofence
            radius, and emergency triggers.
          </p>
        </div>
      </header>

      {/* MAIN CONTAINER WITH SETTINGS NAV & CONTENT */}
      <div className="settings-shell">
        {/* NAV TABS */}
        <aside className="settings-nav">
          <button
            className={activeTab === "notifications" ? "active" : ""}
            onClick={() => setActiveTab("notifications")}
          >
            <Bell size={18} />
            <span>Safety & Alerts</span>
          </button>

          <button
            className={activeTab === "privacy" ? "active" : ""}
            onClick={() => setActiveTab("privacy")}
          >
            <Lock size={18} />
            <span>Privacy & Anonymity</span>
          </button>

          <button
            className={activeTab === "map" ? "active" : ""}
            onClick={() => setActiveTab("map")}
          >
            <Map size={18} />
            <span>Map & Display</span>
          </button>

          <button
            className={activeTab === "account" ? "active" : ""}
            onClick={() => setActiveTab("account")}
          >
            <User size={18} />
            <span>Account Profile</span>
          </button>

          <button
            className={activeTab === "emergency" ? "active" : ""}
            onClick={() => setActiveTab("emergency")}
          >
            <ShieldAlert size={18} />
            <span>Offline & SOS</span>
          </button>
        </aside>

        {/* SETTINGS CONTENT BODY */}
        <main className="settings-body">
          {/* 1. SAFETY & NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="settings-panel">
              <div className="panel-title-wrap">
                <h2>Safety & Alert Notifications</h2>
                <p>
                  Customize when and how Prohori warns you about Dhaka
                  incidents.
                </p>
              </div>

              <div className="settings-section">
                <div className="setting-toggle-row">
                  <div>
                    <strong>Push Notifications for Active Incidents</strong>
                    <p>
                      Receive instant web alerts when a hazard is reported near
                      you.
                    </p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={pushEnabled}
                      onChange={() => setPushEnabled(!pushEnabled)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-toggle-row">
                  <div>
                    <strong>SMS Dispatch for High Risk Red Alerts</strong>
                    <p>
                      Send emergency SMS directly to your phone for severe
                      armed incidents or fires.
                    </p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={smsHighRisk}
                      onChange={() => setSmsHighRisk(!smsHighRisk)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-toggle-row">
                  <div>
                    <strong>Night Quiet Hours (11:00 PM – 6:00 AM)</strong>
                    <p>
                      Mute non-critical civic advisories during night hours. Red
                      alerts will still sound.
                    </p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={quietHours}
                      onChange={() => setQuietHours(!quietHours)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              {/* RADIUS SLIDER */}
              <div className="settings-section">
                <div className="slider-header">
                  <div>
                    <strong>Geofence Monitoring Radius</strong>
                    <p>
                      Alert me for verified incidents occurring within this
                      range.
                    </p>
                  </div>
                  <span className="radius-display-val">{radiusKm} km</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(e.target.value)}
                  className="range-input"
                />
                <div className="range-labels">
                  <span>1 km (Neighborhood)</span>
                  <span>5 km (Thana)</span>
                  <span>10 km (Greater Dhaka)</span>
                </div>
              </div>

              {/* ALERT SOUND */}
              <div className="settings-section">
                <strong>Alert Sound Theme</strong>
                <p className="setting-subtext">
                  Choose audio frequency for incoming danger broadcasts.
                </p>
                <div className="radio-options-grid">
                  {[
                    { id: "urgent", label: "Urgent Siren", desc: "High-pitch warning" },
                    { id: "chime", label: "Gentle Chime", desc: "Subtle two-tone pulse" },
                    { id: "silent", label: "Vibrate / Silent", desc: "No audio alert" },
                  ].map((s) => (
                    <div
                      key={s.id}
                      className={`radio-card ${soundType === s.id ? "selected" : ""}`}
                      onClick={() => setSoundType(s.id)}
                    >
                      <Volume2 size={16} />
                      <div>
                        <strong>{s.label}</strong>
                        <small>{s.desc}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel-save-bar">
                <button
                  className="btn-save-settings"
                  onClick={handleSaveSettings}
                >
                  <Save size={15} />
                  <span>Save Notification Preferences</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. PRIVACY & ANONYMITY */}
          {activeTab === "privacy" && (
            <div className="settings-panel">
              <div className="panel-title-wrap">
                <h2>Privacy & Anonymity Controls</h2>
                <p>
                  Control how your identity and location are broadcasted when
                  reporting hazards in Dhaka.
                </p>
              </div>

              <div className="settings-section">
                <div className="setting-toggle-row">
                  <div>
                    <strong>Default Anonymous Incident Reporting</strong>
                    <p>
                      Automatically hide your name and profile from public
                      incident cards.
                    </p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={anonymousReporting}
                      onChange={() =>
                        setAnonymousReporting(!anonymousReporting)
                      }
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-toggle-row">
                  <div>
                    <strong>Broaden GPS Precision</strong>
                    <p>
                      Show reports at neighborhood/ward level instead of exact
                      building coordinates.
                    </p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={broadenLocation}
                      onChange={() => setBroadenLocation(!broadenLocation)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-toggle-row">
                  <div>
                    <strong>Share Anonymized Safety Analytics</strong>
                    <p>
                      Help Dhaka emergency services analyze crime trends and
                      waterlogging choke points.
                    </p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={shareAggregatedData}
                      onChange={() =>
                        setShareAggregatedData(!shareAggregatedData)
                      }
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <div className="panel-save-bar">
                <button
                  className="btn-save-settings"
                  onClick={handleSaveSettings}
                >
                  <Save size={15} />
                  <span>Update Privacy Settings</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. MAP & DISPLAY */}
          {activeTab === "map" && (
            <div className="settings-panel">
              <div className="panel-title-wrap">
                <h2>Map & Display Preferences</h2>
                <p>
                  Configure Leaflet map layer styles and accessibility
                  settings.
                </p>
              </div>

              <div className="settings-section">
                <strong>Map Tile Rendering Style</strong>
                <p className="setting-subtext">
                  Choose visual contrast for daytime and night-time navigation.
                </p>

                <div className="map-style-grid">
                  <div
                    className={`map-style-card ${
                      mapStyle === "standard" ? "selected" : ""
                    }`}
                    onClick={() => setMapStyle("standard")}
                  >
                    <div className="map-preview-box standard">
                      <span>OSM Daylight</span>
                    </div>
                    <strong>Standard OpenStreetMap</strong>
                    <small>High street visibility</small>
                  </div>

                  <div
                    className={`map-style-card ${
                      mapStyle === "dark" ? "selected" : ""
                    }`}
                    onClick={() => setMapStyle("dark")}
                  >
                    <div className="map-preview-box dark">
                      <span>Night Radar</span>
                    </div>
                    <strong>Night Radar Contrast</strong>
                    <small>Glare-free for dark roads</small>
                  </div>
                </div>
              </div>

              <div className="panel-save-bar">
                <button
                  className="btn-save-settings"
                  onClick={handleSaveSettings}
                >
                  <Save size={15} />
                  <span>Save Map Settings</span>
                </button>
              </div>
            </div>
          )}

          {/* 4. ACCOUNT PROFILE */}
          {activeTab === "account" && (
            <div className="settings-panel">
              <div className="panel-title-wrap">
                <h2>Account Profile & Thana</h2>
                <p>Manage your account credentials and primary Dhaka zone.</p>
              </div>

              <form onSubmit={handleSaveSettings} className="account-form">
                <div className="form-group">
                  <label>Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Primary Thana Affiliation</label>
                  <select
                    value={primaryThana}
                    onChange={(e) => setPrimaryThana(e.target.value)}
                  >
                    <option value="Dhanmondi Thana">Dhanmondi Thana</option>
                    <option value="Gulshan Thana">Gulshan Thana</option>
                    <option value="Banani Thana">Banani Thana</option>
                    <option value="Mirpur Model Thana">Mirpur Model Thana</option>
                    <option value="Uttara East Thana">Uttara East Thana</option>
                    <option value="Mohammadpur Thana">Mohammadpur Thana</option>
                    <option value="Shahbagh Thana">Shahbagh Thana</option>
                  </select>
                </div>

                <div className="panel-save-bar">
                  <button type="submit" className="btn-save-settings">
                    <Save size={15} />
                    <span>Save Account Details</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 5. OFFLINE & SOS */}
          {activeTab === "emergency" && (
            <div className="settings-panel">
              <div className="panel-title-wrap">
                <h2>Emergency SOS & Offline Safety</h2>
                <p>
                  Ensure life-saving emergency contacts and tools remain
                  accessible even when mobile internet drops.
                </p>
              </div>

              <div className="settings-section">
                <div className="setting-toggle-row">
                  <div>
                    <strong>Offline Emergency Helplines Cache</strong>
                    <p>
                      Keep 999, DMP Thana desks, Fire Service, and blood banks
                      cached on device.
                    </p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={offlineCached}
                      onChange={() => setOfflineCached(!offlineCached)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              {/* DANGER ZONE */}
              <div className="danger-zone-card">
                <div>
                  <strong>Clear Local Incident Cache</strong>
                  <p>
                    Purge offline drafts, stored map tiles, and temporary alerts
                    from browser storage.
                  </p>
                </div>
                <button
                  className="btn-danger-action"
                  onClick={() => showToast("Local application cache cleared.")}
                >
                  <Trash2 size={14} />
                  <span>Clear Cache</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Settings;
