import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { MapContainer, Marker, TileLayer, Popup, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Filter,
  MapPin,
  Navigation,
  ShieldCheck,
  X,
} from "lucide-react";

import "leaflet/dist/leaflet.css";
import { useReports } from "../context/ReportsContext";
import { useSavedAreas } from "../context/SavedAreasContext";
import ReportDetailModal from "../components/ReportDetailModal";
import "./LiveMap.css";

const DHAKA_CENTER = [23.8103, 90.4125];
const DHAKA_BOUNDS = [
  [23.65, 90.28],
  [23.92, 90.55],
];

const filters = [
  "All incidents",
  "High risk",
  "Caution",
  "Low risk",
];
const markerStyles = {
  high: { color: "#ef4444", label: "High risk" },
  caution: { color: "#f59e0b", label: "Caution" },
  low: { color: "#3b82f6", label: "Low risk" },
  resolved: { color: "#22c55e", label: "Resolved" },
};

function getMarkerInfo(severity, status) {
  if (status === "resolved") return markerStyles.resolved;
  return markerStyles[severity] || markerStyles.caution;
}

const savedLocationIcons = {
  residential: { label: "Home", icon: "⌂" },
  work: { label: "Office", icon: "▥" },
  campus: { label: "Campus", icon: "⌑" },
  family: { label: "Family", icon: "♥" },
  other: { label: "Saved location", icon: "●" },
};

function isValidLatLng(pos) {
  return (
    Array.isArray(pos) &&
    pos.length >= 2 &&
    typeof pos[0] === "number" &&
    typeof pos[1] === "number" &&
    !isNaN(pos[0]) &&
    !isNaN(pos[1])
  );
}

function createSavedLocationIcon(category) {
  const safeCategory = category in savedLocationIcons ? category : "other";
  const locationIcon = savedLocationIcons[safeCategory] || {
    label: "Saved location",
    icon: "●",
  };
  return divIcon({
    className: "saved-location-marker-wrapper",
    html: `<span class="saved-location-marker ${safeCategory}" aria-label="${locationIcon.label}"><b>${locationIcon.icon}</b></span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
    tooltipAnchor: [0, -21],
  });
}

function createReportPin(severity, status) {
  const marker = getMarkerInfo(severity, status);
  const pinClass =
    status === "resolved"
      ? "resolved"
      : severity in markerStyles
        ? severity
        : "caution";
  return divIcon({
    className: "report-pin-wrapper",
    html: `<span class="report-pin ${pinClass}" style="--pin-color: ${marker.color}" aria-label="${marker.label}"></span>`,
    iconSize: [28, 36],
    iconAnchor: [14, 34],
    popupAnchor: [0, -32],
    tooltipAnchor: [0, -34],
  });
}

function IncidentPopupContent({ incident, marker, onViewReport, mapInstance }) {
  const map = useMap();

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (map && typeof map.closePopup === "function") {
      map.closePopup();
    } else if (mapInstance && typeof mapInstance.closePopup === "function") {
      mapInstance.closePopup();
    }
  };

  const handleOpenDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onViewReport(incident);
  };

  return (
    <div className="incident-popup">
      <div className="incident-popup-top-row">
        <span
          className="incident-popup-severity"
          style={{
            color: marker.color,
            backgroundColor: `${marker.color}15`,
            borderColor: `${marker.color}35`,
          }}
        >
          {marker.label}
        </span>
        <button
          type="button"
          className="incident-popup-close-btn"
          onClick={handleClose}
          aria-label="Close popup"
          title="Close window"
        >
          <X size={15} />
        </button>
      </div>

      <strong
        className="incident-popup-title"
        onClick={handleOpenDetails}
        role="button"
        tabIndex={0}
        title="Click to view report details"
      >
        {incident.title}
      </strong>

      <div
        className="incident-popup-address"
        onClick={handleOpenDetails}
        role="button"
        tabIndex={0}
        title="Click to view report details"
      >
        <MapPin size={12} className="address-pin-icon" />
        <span>{incident.location}</span>
      </div>

      <small className="incident-popup-meta">
        {incident.category} · {incident.time}
      </small>

      <button
        type="button"
        className="incident-popup-action-btn"
        onClick={handleOpenDetails}
      >
        <span>View report details</span>
        <ArrowRight size={13} />
      </button>
    </div>
  );
}

function SavedAreaPopupContent({ area, mapInstance }) {
  const map = useMap();

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (map && typeof map.closePopup === "function") {
      map.closePopup();
    } else if (mapInstance && typeof mapInstance.closePopup === "function") {
      mapInstance.closePopup();
    }
  };

  return (
    <div className="saved-location-popup">
      <div className="saved-location-popup-header">
        <span>SAVED LOCATION</span>
        <button
          type="button"
          className="incident-popup-close-btn"
          onClick={handleClose}
          aria-label="Close popup"
          title="Close window"
        >
          <X size={14} />
        </button>
      </div>
      <strong>{area.name}</strong>
      <p className="saved-location-address">
        <MapPin size={12} className="address-pin-icon" />
        <span>{area.address}</span>
      </p>
      <small>
        {area.thana}
        {area.note ? ` · ${area.note}` : ""}
      </small>
    </div>
  );
}

function LiveMap() {
  const location = useLocation();
  const navState = location.state;
  const { reports } = useReports();
  const { savedAreas } = useSavedAreas();

  const [activeFilter, setActiveFilter] = useState("All incidents");
  const [showReports, setShowReports] = useState(true);
  const [showSavedAreas, setShowSavedAreas] = useState(false);
  const [activeDetailModal, setActiveDetailModal] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [mapInstance, setMapInstance] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleViewReport = (report) => {
    setActiveDetailModal(report);
  };

  const visibleIncidents = useMemo(() => {
    if (!Array.isArray(reports)) return [];
    if (activeFilter === "All incidents") return reports;
    if (activeFilter === "High risk")
      return reports.filter(({ severity }) => severity === "high");
    if (activeFilter === "Caution")
      return reports.filter(({ severity }) => severity === "caution");
    if (activeFilter === "Low risk")
      return reports.filter(({ severity }) => severity === "low");
    return reports;
  }, [activeFilter, reports]);

  return (
    <div className="live-map-page">
      {navState && (
        <div className={`map-context-banner ${navState.from}`}>
          <div className="context-banner-icon">
            {navState.from === "location" ? (
              <Bookmark size={16} />
            ) : (
              <AlertTriangle size={16} />
            )}
          </div>
          <div className="context-banner-text">
            <strong>
              {navState.from === "location" ? navState.name : navState.title}
            </strong>
            <span>
              {navState.thana && (
                <>
                  <MapPin size={12} /> {navState.thana}
                </>
              )}
              {navState.category && <> · {navState.category}</>}
              {navState.location && <> · {navState.location}</>}
            </span>
          </div>
          <button
            className="context-banner-close"
            onClick={() => window.history.back()}
          >
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
        <div className="dhaka-badge">
          <MapPin size={16} /> Dhaka only
        </div>
      </header>

      <section className="live-map-content">
        <div className="map-toolbar">
          <button
            className="filter-toggle"
            onClick={() => setShowReports((visible) => !visible)}
          >
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
            ref={setMapInstance}
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
              attribution={
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              }
            />

            {visibleIncidents.map((incident) => {
              const marker = getMarkerInfo(incident.severity, incident.status);
              const position = isValidLatLng(incident.position)
                ? incident.position
                : DHAKA_CENTER;
              return (
                <Marker
                  key={incident.id || incident._id}
                  position={position}
                  icon={createReportPin(incident.severity, incident.status)}
                  zIndexOffset={1000}
                >
                  <Popup
                    offset={[0, -4]}
                    closeButton={false}
                    autoPan={true}
                    autoPanPadding={[24, 24]}
                  >
                    <IncidentPopupContent
                      incident={incident}
                      marker={marker}
                      onViewReport={handleViewReport}
                      mapInstance={mapInstance}
                    />
                  </Popup>
                </Marker>
              );
            })}

            {showSavedAreas &&
              savedAreas.map((area) => {
                const areaPos = isValidLatLng(area.position)
                  ? area.position
                  : DHAKA_CENTER;
                return (
                  <Marker
                    key={area.id || area._id}
                    position={areaPos}
                    icon={createSavedLocationIcon(area.category)}
                    title={`${area.name} (${savedLocationIcons[area.category]?.label || "Saved location"})`}
                    zIndexOffset={500}
                  >
                    <Popup
                      offset={[0, -4]}
                      closeButton={false}
                      autoPan={true}
                      autoPanPadding={[24, 24]}
                    >
                      <SavedAreaPopupContent
                        area={area}
                        mapInstance={mapInstance}
                      />
                    </Popup>
                  </Marker>
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
                <button
                  aria-label="Close recent reports"
                  onClick={() => setShowReports(false)}
                >
                  <X size={16} />
                </button>
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
                  const marker = getMarkerInfo(
                    incident.severity,
                    incident.status,
                  );
                  return (
                    <div
                      className="map-report-item"
                      key={incident.id || incident._id}
                      onClick={() => handleViewReport(incident)}
                      title="Click to view report details"
                      style={{ cursor: "pointer" }}
                    >
                      <i style={{ background: marker.color }}></i>
                      <div>
                        <strong>{incident.title}</strong>
                        <span>
                          <MapPin size={11} /> {incident.location}
                        </span>
                      </div>
                      <time>{incident.time}</time>
                    </div>
                  );
                })}
              </div>
            </aside>
          )}

          <div className="map-location-note">
            <Navigation size={14} /> Map limited to Dhaka
          </div>
        </div>

        <div className="map-bottom-bar">
          <div className="map-legend-live">
            <span>
              <i className="risk"></i>High risk
            </span>
            <span>
              <i className="caution"></i>Caution
            </span>
            <span>
              <i className="low"></i>Low risk
            </span>
            {showSavedAreas && (
              <>
                <span>
                  <i className="saved home"></i>Home
                </span>
                <span>
                  <i className="saved office"></i>Office
                </span>
                <span>
                  <i className="saved campus"></i>Campus
                </span>
                <span>
                  <i className="saved family"></i>Family
                </span>
              </>
            )}
          </div>
          <div className="map-status">
            <ShieldCheck size={15} /> Updated just now
          </div>
        </div>
      </section>

      {/* REPORT DETAIL MODAL */}
      {activeDetailModal && (
        <ReportDetailModal
          report={activeDetailModal}
          onClose={() => setActiveDetailModal(null)}
          onToast={showToast}
        />
      )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="livemap-toast">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default LiveMap;
