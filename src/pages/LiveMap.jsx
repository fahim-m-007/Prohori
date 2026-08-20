import { useMemo, useState } from "react";
import { CircleMarker, MapContainer, TileLayer, Tooltip } from "react-leaflet";
import { Filter, MapPin, Navigation, ShieldCheck, X } from "lucide-react";

import "leaflet/dist/leaflet.css";
import "./LiveMap.css";

const DHAKA_CENTER = [23.8103, 90.4125];
const DHAKA_BOUNDS = [
  [23.65, 90.28],
  [23.92, 90.55],
];

const incidents = [
  {
    id: 1,
    type: "Road accident",
    category: "Transportation",
    location: "Gulshan 1",
    time: "12 min ago",
    status: "verified",
    position: [23.7806, 90.4168],
  },
  {
    id: 2,
    type: "Heavy waterlogging",
    category: "Civic issue",
    location: "Mirpur 10",
    time: "23 min ago",
    status: "caution",
    position: [23.8067, 90.3688],
  },
  {
    id: 3,
    type: "Traffic disruption",
    category: "Transportation",
    location: "Farmgate",
    time: "41 min ago",
    status: "info",
    position: [23.7575, 90.3888],
  },
  {
    id: 4,
    type: "Area cleared",
    category: "Public safety",
    location: "Dhanmondi 27",
    time: "1 hr ago",
    status: "safe",
    position: [23.7465, 90.3742],
  },
  {
    id: 5,
    type: "Suspicious activity",
    category: "Public safety",
    location: "Uttara Sector 7",
    time: "1 hr ago",
    status: "verified",
    position: [23.8759, 90.3972],
  },
];

const filters = ["All incidents", "High risk", "Caution", "Resolved"];
const markerStyles = {
  verified: { color: "#ef4444", label: "High risk" },
  caution: { color: "#f59e0b", label: "Caution" },
  info: { color: "#0ea5e9", label: "Active" },
  safe: { color: "#22c55e", label: "Resolved" },
};

function LiveMap() {
  const [activeFilter, setActiveFilter] = useState("All incidents");
  const [showReports, setShowReports] = useState(true);

  const visibleIncidents = useMemo(() => {
    if (activeFilter === "All incidents") return incidents;
    if (activeFilter === "High risk") return incidents.filter(({ status }) => status === "verified");
    if (activeFilter === "Caution") return incidents.filter(({ status }) => status === "caution");
    return incidents.filter(({ status }) => status === "safe");
  }, [activeFilter]);

  return (
    <div className="live-map-page">
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
              const marker = markerStyles[incident.status];
              return (
                <CircleMarker
                  key={incident.id}
                  center={incident.position}
                  radius={10}
                  pathOptions={{ color: "white", fillColor: marker.color, fillOpacity: 1, weight: 4 }}
                >
                  <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                    <div className="incident-popup">
                      <span style={{ color: marker.color }}>{marker.label}</span>
                      <strong>{incident.type}</strong>
                      <p>{incident.location}</p>
                      <small>{incident.category} · {incident.time}</small>
                    </div>
                  </Tooltip>
                </CircleMarker>
              );
            })}
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
                  const marker = markerStyles[incident.status];
                  return (
                    <div className="map-report-item" key={incident.id}>
                      <i style={{ background: marker.color }}></i>
                      <div>
                        <strong>{incident.type}</strong>
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
            <span><i className="active"></i>Active</span>
            <span><i className="resolved"></i>Resolved</span>
          </div>
          <div className="map-status"><ShieldCheck size={15} /> Updated just now</div>
        </div>
      </section>
    </div>
  );
}

export default LiveMap;
