import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet";
import { divIcon } from "leaflet";
import { AlertTriangle, ArrowLeft, Bookmark, Filter, MapPin, Navigation, ShieldCheck, X } from "lucide-react";

import "leaflet/dist/leaflet.css";
import { useReports } from "../context/ReportsContext";
import { useSavedAreas } from "../context/SavedAreasContext";
import "./LiveMap.css";

const DHAKA_CENTER = [23.8103, 90.4125];
const DHAKA_BOUNDS = [
  [23.65, 90.28],
  [23.92, 90.55],
];

const filters = ["All incidents", "High risk", "Caution", "Resolved"];
const markerStyles = {
  high: { color: "#ef4444", label: "High risk" },
  caution: { color: "#f59e0b", label: "Caution" },
  resolved: { color: "#22c55e", label: "Resolved" },
};

const savedLocationIcons = {
  residential: { label: "Home", icon: "⌂" },
  work: { label: "Office", icon: "▥" },
  campus: { label: "Campus", icon: "⌑" },
  family: { label: "Family", icon: "♥" },
};

function createSavedLocationIcon(category) {
  const locationIcon = savedLocationIcons[category] || { label: "Saved location", icon: "●" };
  return divIcon({
    className: "saved-location-marker-wrapper",
    html: `<span class="saved-location-marker ${category}" aria-label="${locationIcon.label}"><b>${locationIcon.icon}</b></span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    tooltipAnchor: [0, -21],
  });
}

function createReportPin(severity) {
  const marker = markerStyles[severity];
  return divIcon({
    className: "report-pin-wrapper",
    html: `<span class="report-pin ${severity}" style="--pin-color: ${marker.color}" aria-label="${marker.label}"></span>`,
    iconSize: [28, 36],
    iconAnchor: [14, 34],
    tooltipAnchor: [0, -34],
  });
}

function LiveMap() {
  const location = useLocation();
  const navState = location.state;
  const { reports } = useReports();
  const { savedAreas } = useSavedAreas();

  const [activeFilter, setActiveFilter] = useState("All incidents");
  const [showReports, setShowReports] = useState(true);
  const [showSavedAreas, setShowSavedAreas] = useState(false);

  const visibleIncidents = useMemo(() => {
    if (activeFilter === "All incidents") return reports;
    if (activeFilter === "High risk") return reports.filter(({ severity }) => severity === "high");
    if (activeFilter === "Caution") return reports.filter(({ severity }) => severity === "caution");
    return reports.filter(({ status }) => status === "resolved");
  }, [activeFilter, reports]);

  return (
    <div className="live-map-page">
      {navState && (
        <div className={`map-context-banner ${navState.from}`}>
          <div className="context-banner-icon">
            {navState.from === "location" ? <Bookmark size={16} /> : <AlertTriangle size={16} />}
          </div>
          <div className="context-banner-text">
            <strong>
              {navState.from === "location"
                ? navState.name
                : navState.title}
            </strong>
            <span>
              {navState.thana && <><MapPin size={12} /> {navState.thana}</>}
              {navState.category && <> · {navState.category}</>}
              {navState.location && <> · {navState.location}</>}
            </span>
          </div>
          <button className="context-banner-close" onClick={() => window.history.back()}>
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>
        </div>
      )}

      <header className="live-map-header">
        <div>
          <span className="map-eyebrow">LIVE OVERVIEW</span>
          <h1>Dhaka Safety Map</h1>
          <p>Track community reports and active incidents across Dhaka.</p>
        </div>
        <div className="dhaka-badge"><MapPin size={16} /> Dhaka only</div>
      </header>

      <section className="live-map-content">
        <div className="map-toolbar">
          <button className="filter-toggle" onClick={() => setShowReports((visible) => !visible)}>
            <Filter size={16} />
            Recent reports
          </button>
          <button
            className={`filter-toggle saved-areas-toggle ${showSavedAreas ? "selected" : ""}`}
            onClick={() => setShowSavedAreas((visible) => !visible)}
            aria-pressed={showSavedAreas}
          >
            <Bookmark size={16} />
            {showSavedAreas ? "Hide saved areas" : "Show saved areas"}
          </button>
          <span>{visibleIncidents.length} reports visible</span>
        </div>

        <div className="live-map-shell">
          <MapContainer
            className="leaflet-map"
            center={DHAKA_CENTER}
            zoom={12}
            minZoom={11}
            maxZoom={18}
            maxBounds={DHAKA_BOUNDS}
            maxBoundsViscosity={1}
            scrollWheelZoom
          >
            <TileLayer
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution={'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
            />

            {visibleIncidents.map((incident) => {
              const markerKey = incident.status === "resolved" ? "resolved" : incident.severity;
              const marker = markerStyles[markerKey];
              return (
                <Marker
                  key={incident.id}
                  position={incident.position}
                  icon={createReportPin(markerKey)}
                  zIndexOffset={1000}
                >
                  <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                    <div className="incident-popup">
                      <span style={{ color: marker.color }}>{marker.label}</span>
                      <strong>{incident.title}</strong>
                      <p>{incident.location}</p>
                      <small>{incident.category} · {incident.time}</small>
                    </div>
                  </Tooltip>
                </Marker>
              );
            })}

            {showSavedAreas && savedAreas.map((area) => (
              <Marker
                key={area.id}
                position={area.position}
                icon={createSavedLocationIcon(area.category)}
                title={`${area.name} (${savedLocationIcons[area.category]?.label || "Saved location"})`}
                zIndexOffset={500}
              >
                <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                  <div className="saved-location-popup">
                    <span>SAVED LOCATION</span>
                    <strong>{area.name}</strong>
                    <p>{area.address}</p>
                    <small>{area.thana} · Safety index {area.safetyScore}/100</small>
                  </div>
                </Tooltip>
              </Marker>
            ))}
          </MapContainer>

          {showReports && (
            <aside className="map-reports-panel">
              <div className="reports-panel-heading">
                <div>
                  <span>COMMUNITY ACTIVITY</span>
                  <strong>Recent reports</strong>
                </div>
                <button aria-label="Close recent reports" onClick={() => setShowReports(false)}><X size={16} /></button>
              </div>
              <div className="filter-options">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    className={activeFilter === filter ? "selected" : ""}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <div className="map-report-list">
                {visibleIncidents.map((incident) => {
                  const marker = markerStyles[incident.status === "resolved" ? "resolved" : incident.severity];
                  return (
                    <div className="map-report-item" key={incident.id}>
                      <i style={{ background: marker.color }}></i>
                      <div>
                        <strong>{incident.title}</strong>
                        <span><MapPin size={11} /> {incident.location}</span>
                      </div>
                      <time>{incident.time}</time>
                    </div>
                  );
                })}
              </div>
            </aside>
          )}

          <div className="map-location-note"><Navigation size={14} /> Map limited to Dhaka</div>
        </div>

        <div className="map-bottom-bar">
          <div className="map-legend-live">
            <span><i className="risk"></i>High risk</span>
            <span><i className="caution"></i>Caution</span>
            <span><i className="resolved"></i>Resolved</span>
            {showSavedAreas && <>
              <span><i className="saved home"></i>Home</span>
              <span><i className="saved office"></i>Office</span>
              <span><i className="saved campus"></i>Campus</span>
              <span><i className="saved family"></i>Family</span>
            </>}
          </div>
          <div className="map-status"><ShieldCheck size={15} /> Updated just now</div>
        </div>
      </section>
    </div>
  );
}

export default LiveMap;
