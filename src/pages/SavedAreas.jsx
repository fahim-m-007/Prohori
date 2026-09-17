import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  CircleMarker,
  MapContainer,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import {
  AlertTriangle,
  Bookmark,
  Building2,
  ChevronDown,
  Clock,
  Eye,
  FileText,
  GraduationCap,
  Home,
  Map as MapIcon,
  MapPin,
  Navigation,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import "./SavedAreas.css";
import { useReports } from "../context/ReportsContext";
import { useSavedAreas } from "../context/SavedAreasContext";
import ReportDetailModal from "../components/ReportDetailModal";

const dhakaLocations = [
  { name: "Gulshan 1 Circle", detail: "Gulshan, Dhaka" },
  { name: "Gulshan 2 Circle", detail: "Gulshan, Dhaka" },
  { name: "Mirpur 10 Roundabout", detail: "Mirpur, Dhaka" },
  { name: "Farmgate", detail: "Tejgaon, Dhaka" },
  { name: "Dhanmondi 27", detail: "Dhanmondi, Dhaka" },
  {
    name: "Hazrat Shahjalal International Airport",
    detail: "Airport Road, Dhaka",
  },
  { name: "Shahbagh", detail: "Shahbagh, Dhaka" },
  { name: "Uttara Sector 7", detail: "Uttara, Dhaka" },
  { name: "Motijheel Shapla Chattar", detail: "Motijheel, Dhaka" },
  { name: "Bashundhara Gate", detail: "Kuril, Dhaka" },
  { name: "New Market", detail: "Dhanmondi, Dhaka" },
];

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
  "Wari",
];

const geoapifyKey = import.meta.env.VITE_GEOAPIFY_KEY;
const DHAKA_CENTER = [23.8103, 90.4125];
const DHAKA_BOUNDS = [
  [23.65, 90.28],
  [23.92, 90.55],
];

function findLocalLocations(query) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  return dhakaLocations
    .filter(({ name, detail }) =>
      `${name} ${detail}`.toLocaleLowerCase().includes(normalizedQuery),
    )
    .slice(0, 5);
}

function MapClickHandler({ onPick }) {
  useMapEvents({
    click(event) {
      onPick([event.latlng.lat, event.latlng.lng]);
    },
  });
  return null;
}

function LocationMapPicker({ position, onPick }) {
  return (
    <MapContainer
      className="location-picker-map"
      center={position || DHAKA_CENTER}
      zoom={13}
      minZoom={11}
      maxZoom={18}
      maxBounds={DHAKA_BOUNDS}
      maxBoundsViscosity={1}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution={
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
      />
      <MapClickHandler onPick={onPick} />
      {position && (
        <CircleMarker
          center={position}
          radius={9}
          pathOptions={{
            color: "white",
            fillColor: "#2563eb",
            fillOpacity: 1,
            weight: 4,
          }}
        />
      )}
    </MapContainer>
  );
}

function SavedAreas() {
  const { reports } = useReports();
  const { savedAreas, createSavedArea, deleteSavedArea, isLoading } =
    useSavedAreas();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);
  const [isDeletingLocation, setIsDeletingLocation] = useState(false);
  const [activeReportModal, setActiveReportModal] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Form State
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("residential");
  const [formAddress, setFormAddress] = useState("");
  const [formNote, setFormNote] = useState("");
  const [locationCoordinates, setLocationCoordinates] = useState(null);

  // Thana Dropdown states (like register page)
  const [thanaSearch, setThanaSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const listRef = useRef(null);

  const filteredThanas = thanaList.filter((t) =>
    t.toLowerCase().includes(thanaSearch.toLowerCase()),
  );

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isDropdownOpen && listRef.current && highlightedIndex >= 0) {
      const items = listRef.current.querySelectorAll(".custom-dropdown-item");
      if (items[highlightedIndex]) {
        items[highlightedIndex].scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isDropdownOpen]);

  // Location Autocomplete State
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");

  const displayedSuggestions = useMemo(
    () => (geoapifyKey ? suggestions : findLocalLocations(formAddress)),
    [formAddress, suggestions],
  );

  // Location Search API with debounce
  useEffect(() => {
    const query = formAddress.trim();
    if (!query || !geoapifyKey) return undefined;

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsSearchingLocation(true);
      const searchLocations = async (text, filter, bias) => {
        const parameters = new URLSearchParams({
          text,
          apiKey: geoapifyKey,
          filter,
          bias,
          format: "json",
          limit: "5",
        });
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?${parameters}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error("Location search failed");

        const { results = [] } = await response.json();
        return results
          .map((result) => ({
            id: result.place_id,
            name: result.address_line1 || result.name || result.formatted,
            detail:
              result.address_line2 || result.formatted || "Dhaka, Bangladesh",
            coordinates: [result.lat, result.lon],
          }))
          .filter(({ name }) => name);
      };

      try {
        const strictDhakaResults = await searchLocations(
          query,
          "rect:90.28,23.65,90.55,23.92|countrycode:bd",
          "proximity:90.4125,23.8103",
        );

        if (strictDhakaResults.length > 0) {
          setSuggestions(strictDhakaResults);
        } else {
          const broaderDhakaResults = await searchLocations(
            `${query}, Dhaka, Bangladesh`,
            "countrycode:bd",
            "circle:90.4125,23.8103,30000",
          );
          setSuggestions(broaderDhakaResults);
        }
      } catch (error) {
        if (error.name !== "AbortError")
          setSuggestions(findLocalLocations(query));
      } finally {
        if (!controller.signal.aborted) setIsSearchingLocation(false);
      }
    }, 350);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [formAddress]);

  const selectSuggestion = (loc) => {
    setFormAddress(`${loc.name}, ${loc.detail}`);
    setLocationCoordinates(loc.coordinates || null);
    setShowSuggestions(false);
    setActiveSuggestion(-1);
    setLocationMessage("Coordinates set from suggestion.");
  };

  const selectMapLocation = (coordinates) => {
    setLocationCoordinates(coordinates);
    if (!formAddress.trim()) {
      setFormAddress(
        `Pinned location (${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)})`,
      );
    }
    setShowSuggestions(false);
    setLocationMessage("Coordinates pinned on Dhaka map.");
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage(
        "Your browser does not support location access. Please pick on the map.",
      );
      return;
    }

    setLocationMessage("Finding your location...");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        selectMapLocation([coords.latitude, coords.longitude]);
        setIsMapPickerOpen(true);
      },
      () =>
        setLocationMessage(
          "Could not access your location. Pick a point on the map instead.",
        ),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleSelectThana = (thana) => {
    setThanaSearch(thana);
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
  };

  const handleThanaKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isDropdownOpen) {
        setIsDropdownOpen(true);
        setHighlightedIndex(0);
      } else if (filteredThanas.length > 0) {
        setHighlightedIndex((prev) =>
          prev < filteredThanas.length - 1 ? prev + 1 : 0,
        );
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isDropdownOpen) {
        setIsDropdownOpen(true);
        setHighlightedIndex(filteredThanas.length - 1);
      } else if (filteredThanas.length > 0) {
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredThanas.length - 1,
        );
      }
    } else if (e.key === "Enter") {
      if (isDropdownOpen && filteredThanas.length > 0) {
        e.preventDefault();
        const selected =
          highlightedIndex >= 0 && highlightedIndex < filteredThanas.length
            ? filteredThanas[highlightedIndex]
            : filteredThanas[0];
        handleSelectThana(selected);
      } else if (isDropdownOpen && filteredThanas.length === 0) {
        e.preventDefault();
      }
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const handleLocationKeyDown = (event) => {
    if (!displayedSuggestions.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveSuggestion(
        (current) => (current + 1) % displayedSuggestions.length,
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSuggestion(
        (current) =>
          (current - 1 + displayedSuggestions.length) %
          displayedSuggestions.length,
      );
    }

    if (event.key === "Enter" && activeSuggestion >= 0) {
      event.preventDefault();
      selectSuggestion(displayedSuggestions[activeSuggestion]);
    }

    if (event.key === "Escape") setShowSuggestions(false);
  };

  // Compute recent alerts (last 3 days) near saved areas
  const recentAlerts = useMemo(() => {
    return reports
      .filter((report) => {
        const timeStr = report.time || "";
        const daysMatch = timeStr.match(/(\d+)\s*days?/i);
        if (daysMatch) {
          const days = parseInt(daysMatch[1], 10);
          if (days > 3) return false;
        }
        if (
          timeStr.toLowerCase().includes("week") ||
          timeStr.toLowerCase().includes("month") ||
          timeStr.toLowerCase().includes("year")
        ) {
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

  // Unique thanas covered
  const monitoredThanasCount = useMemo(() => {
    const set = new Set(savedAreas.map((a) => a.thana));
    return set.size;
  }, [savedAreas]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleConfirmDelete = async () => {
    if (!locationToDelete) return;
    setIsDeletingLocation(true);
    try {
      await deleteSavedArea(locationToDelete.id || locationToDelete._id);
      showToast(`Removed "${locationToDelete.name}" from saved areas`);
      setLocationToDelete(null);
    } catch (err) {
      showToast(err.message || "Failed to remove saved location.");
    } finally {
      setIsDeletingLocation(false);
    }
  };

  const handleOpenAddModal = () => {
    setFormName("");
    setFormCategory("residential");
    setThanaSearch("");
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
    setFormAddress("");
    setFormNote("");
    setLocationCoordinates(null);
    setLocationMessage("");
    setIsMapPickerOpen(false);
    setFormError("");
    setIsAddModalOpen(true);
  };

  const handleCreateArea = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formName.trim()) {
      setFormError(
        "Please enter a name / label for this place (e.g. Home, Office).",
      );
      return;
    }
    if (!thanaSearch.trim()) {
      setFormError("Please select your Thana from the dropdown.");
      return;
    }
    if (!formAddress.trim()) {
      setFormError("Please provide an address or location landmark.");
      return;
    }

    setIsSubmitting(true);
    try {
      const newArea = await createSavedArea({
        name: formName.trim(),
        category: formCategory,
        thana: thanaSearch.trim(),
        address: formAddress.trim(),
        position: locationCoordinates || DHAKA_CENTER,
        note: formNote.trim(),
      });

      setIsAddModalOpen(false);
      showToast(`Added "${newArea.name}" to your saved areas!`);
    } catch (err) {
      setFormError(err.message || "Failed to save location. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case "residential":
        return <Home size={18} />;
      case "work":
        return <Building2 size={18} />;
      case "campus":
        return <GraduationCap size={18} />;
      case "family":
        return <Users size={18} />;
      default:
        return <Bookmark size={18} />;
    }
  };

  // Helper to get active alerts for a specific thana
  const getThanaRecentAlerts = (thana) => {
    return recentAlerts.filter((r) => r.thana === thana);
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
            Monitor live incidents, safety updates, and neighborhood notices for
            your key places across Dhaka.
          </p>
        </div>

        <button className="btn-add-zone" onClick={handleOpenAddModal}>
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
          <strong
            style={{ color: recentAlerts.length > 0 ? "#f59e0b" : "#22c55e" }}
          >
            {recentAlerts.length} Reported
          </strong>
          <small>Incidents near your saved places</small>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-item">
          <span className="summary-title">Monitored Thanas</span>
          <strong style={{ color: "var(--navy)" }}>
            {monitoredThanasCount} Thana Areas
          </strong>
          <small>Across Dhaka Metropolitan</small>
        </div>
      </div>

      {/* RECENT ALERTS IN SAVED AREAS (LAST 3 DAYS) */}
      <section className="saved-alerts-section">
        <div className="section-title-row">
          <div>
            <h2>Recent Alerts in Saved Areas (Last 3 Days)</h2>
            <p>
              Incidents, road hazards, and community notices reported around
              your saved locations.
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
              All your saved areas are clear. No incidents reported in the last
              3 days.
            </span>
          </div>
        ) : (
          <div className="saved-alerts-grid horizontal-scroll">
            {recentAlerts.map((alert) => (
              <div
                className={`saved-alert-card ${alert.severity}`}
                key={alert.id || alert._id}
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
                    <span>{alert.timeTag || alert.time}</span>
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

                  <div className="alert-footer-actions">
                    <button
                      type="button"
                      className="btn-view-alert-details"
                      onClick={() => setActiveReportModal(alert)}
                      title="View complete report and community updates"
                    >
                      <Eye size={13} />
                      <span>View</span>
                    </button>

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
                      <span>Live Map</span>
                    </Link>
                  </div>
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
            <p>
              Manage your home, workplace, campus, and regular destinations.
            </p>
          </div>
          <span className="count-pill">{savedAreas.length} Saved</span>
        </div>

        {isLoading ? (
          <div className="saved-loading-state">
            <span className="spinner-sm"></span>
            <span>Loading your saved locations...</span>
          </div>
        ) : savedAreas.length === 0 ? (
          <div className="saved-empty-state">
            <Bookmark size={36} />
            <h3>No saved locations yet</h3>
            <p>
              Add your home, office, or regular spots to receive live safety
              updates and alerts.
            </p>
            <button className="btn-add-zone" onClick={handleOpenAddModal}>
              <Plus size={16} />
              <span>Add Your First Location</span>
            </button>
          </div>
        ) : (
          <div className="saved-locations-grid">
            {savedAreas.map((area) => {
              const areaAlerts = getThanaRecentAlerts(area.thana);
              const hasAlerts = areaAlerts.length > 0;

              return (
                <div className="saved-location-card" key={area.id || area._id}>
                  <div className="location-card-top">
                    <div
                      className={`location-cat-icon ${area.category || "residential"}`}
                    >
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

                  {/* USER NOTE (IF PRESENT) */}
                  {area.note && (
                    <div className="location-user-note">
                      <FileText size={13} />
                      <span>{area.note}</span>
                    </div>
                  )}

                  {/* DYNAMIC LIVE NEIGHBORHOOD STATUS */}
                  <div
                    className={`location-status-note ${hasAlerts ? "has-alert" : "all-clear"}`}
                  >
                    {hasAlerts ? (
                      <>
                        <AlertTriangle
                          size={15}
                          className="hazard-alert-icon"
                        />
                        <p>
                          <strong>
                            {areaAlerts.length} recent alert
                            {areaAlerts.length > 1 ? "s" : ""}
                          </strong>{" "}
                          reported in {area.thana} in the last 3 days.
                        </p>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={15} className="hazard-safe-icon" />
                        <p>
                          All clear &middot; No active incidents reported in{" "}
                          {area.thana} in the last 3 days.
                        </p>
                      </>
                    )}
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
                        position: area.position,
                        category: area.category,
                      }}
                    >
                      <Navigation size={13} />
                      <span>View on Map</span>
                    </Link>

                    <button
                      className="btn-location-delete"
                      onClick={() => setLocationToDelete(area)}
                      title="Delete Saved Location"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ADD SAVED LOCATION MODAL WITH LOCATION PICKER & MAP */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog modal-dialog-wide">
            <div className="modal-header">
              <div className="modal-title-group">
                <Bookmark size={20} />
                <h3>Add New Saved Location</h3>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setIsAddModalOpen(false)}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateArea} className="modal-form">
              {formError && (
                <div className="modal-error-box" role="alert">
                  <AlertTriangle size={15} />
                  <span>{formError}</span>
                </div>
              )}

              <div className="form-row-2">
                <div className="form-group">
                  <label>Location Name / Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Home, Office, Gym"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                  >
                    <option value="residential">Residential / Home</option>
                    <option value="work">Workplace / Office</option>
                    <option value="campus">University / Campus</option>
                    <option value="family">Family &amp; Friends</option>
                    <option value="other">Other / Landmark</option>
                  </select>
                </div>
              </div>

              {/* SELECT YOUR THANA (MATCHING REGISTER PAGE) */}
              <div
                className="form-group thana-dropdown-field"
                ref={dropdownRef}
                style={{
                  position: "relative",
                  zIndex: isDropdownOpen ? 100 : 10,
                }}
              >
                <label htmlFor="thana">Select your Thana</label>
                <div className="dropdown-input-wrapper">
                  <input
                    id="thana"
                    type="text"
                    autoComplete="off"
                    placeholder="Select or search Thana"
                    value={thanaSearch}
                    onChange={(e) => {
                      setThanaSearch(e.target.value);
                      setIsDropdownOpen(true);
                      setHighlightedIndex(0);
                    }}
                    onFocus={() => {
                      setIsDropdownOpen(true);
                      if (
                        highlightedIndex === -1 &&
                        filteredThanas.length > 0
                      ) {
                        setHighlightedIndex(0);
                      }
                    }}
                    onClick={() => setIsDropdownOpen(true)}
                    onKeyDown={handleThanaKeyDown}
                    required
                  />
                  <button
                    type="button"
                    className="dropdown-toggle-button"
                    onClick={() => {
                      setIsDropdownOpen((prev) => {
                        const nextState = !prev;
                        if (nextState) setHighlightedIndex(0);
                        return nextState;
                      });
                    }}
                    tabIndex={-1}
                    aria-label="Toggle thana dropdown"
                  >
                    <ChevronDown
                      size={16}
                      className={`dropdown-chevron ${isDropdownOpen ? "open" : ""}`}
                    />
                  </button>
                </div>
                {isDropdownOpen && (
                  <div
                    className="custom-dropdown-menu"
                    ref={listRef}
                    role="listbox"
                  >
                    {filteredThanas.length > 0 ? (
                      filteredThanas.map((thana, index) => (
                        <div
                          key={thana}
                          role="option"
                          aria-selected={highlightedIndex === index}
                          className={`custom-dropdown-item ${
                            highlightedIndex === index ? "highlighted" : ""
                          }`}
                          onMouseEnter={() => setHighlightedIndex(index)}
                          onClick={() => handleSelectThana(thana)}
                        >
                          {thana}
                        </div>
                      ))
                    ) : (
                      <div className="custom-dropdown-empty">
                        No thanas found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* LOCATION AUTOCOMPLETE & GPS (LIKE REPORT INCIDENT) */}
              <div className="form-group">
                <label>Location / Address / Landmark</label>
                <div className="location-autocomplete">
                  <div className="location-input">
                    <MapPin size={18} />
                    <input
                      type="text"
                      value={formAddress}
                      placeholder="Search an area, road, or landmark"
                      role="combobox"
                      aria-autocomplete="list"
                      aria-expanded={
                        showSuggestions && formAddress.trim().length > 0
                      }
                      aria-controls="saved-location-suggestions"
                      onChange={(event) => {
                        setFormAddress(event.target.value);
                        setShowSuggestions(true);
                        setActiveSuggestion(-1);
                        setSuggestions([]);
                        setIsSearchingLocation(false);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onKeyDown={handleLocationKeyDown}
                      required
                    />
                    <button type="button" onClick={useCurrentLocation}>
                      Use my location
                    </button>
                  </div>

                  {showSuggestions && formAddress.trim() && (
                    <ul
                      className="location-suggestions"
                      id="saved-location-suggestions"
                      role="listbox"
                    >
                      {isSearchingLocation && (
                        <li className="location-search-message">
                          Finding locations in Dhaka...
                        </li>
                      )}
                      {!isSearchingLocation &&
                        displayedSuggestions.map((loc, index) => (
                          <li
                            key={loc.name}
                            role="option"
                            aria-selected={index === activeSuggestion}
                          >
                            <button
                              type="button"
                              className={
                                index === activeSuggestion ? "active" : ""
                              }
                              onMouseDown={(event) => event.preventDefault()}
                              onClick={() => selectSuggestion(loc)}
                            >
                              <MapPin size={16} />
                              <span>
                                <strong>{loc.name}</strong>
                                <small>{loc.detail}</small>
                              </span>
                            </button>
                          </li>
                        ))}
                      {!isSearchingLocation &&
                        displayedSuggestions.length === 0 && (
                          <li className="location-search-message">
                            No Dhaka locations found. Try an area, road, or
                            landmark.
                          </li>
                        )}
                      {geoapifyKey &&
                        !isSearchingLocation &&
                        displayedSuggestions.length > 0 && (
                          <li className="location-search-attribution">
                            Search powered by Geoapify
                          </li>
                        )}
                    </ul>
                  )}
                </div>

                <div className="location-map-actions">
                  <button
                    type="button"
                    onClick={() => setIsMapPickerOpen((open) => !open)}
                  >
                    <MapIcon size={15} />
                    {isMapPickerOpen
                      ? "Hide map picker"
                      : "Pick location on the Dhaka map"}
                  </button>
                  <span>Click to drop a pin</span>
                </div>

                {locationMessage && (
                  <p className="location-message">{locationMessage}</p>
                )}

                {/* LEAFLET MAP PICKER (LIKE REPORT INCIDENT) */}
                {isMapPickerOpen && (
                  <div className="location-picker">
                    <div className="location-picker-heading">
                      <div>
                        <strong>Pin the exact spot</strong>
                        <span>
                          Click anywhere on the Dhaka map to place your pin
                          marker.
                        </span>
                      </div>
                      <button
                        type="button"
                        aria-label="Close location map"
                        onClick={() => setIsMapPickerOpen(false)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <LocationMapPicker
                      position={locationCoordinates}
                      onPick={selectMapLocation}
                    />
                  </div>
                )}
              </div>

              {/* OPTIONAL USER NOTE */}
              <div className="form-group">
                <label>
                  Personal Note / Details{" "}
                  <span className="optional-tag">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Main gate closes at 11 PM, Flat 4B, 3rd floor"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  maxLength={150}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-modal-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-sm"></span>
                      <span>Saving...</span>
                    </>
                  ) : (
                    "Save Location"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {locationToDelete && (
        <div
          className="modal-overlay"
          onClick={() => !isDeletingLocation && setLocationToDelete(null)}
        >
          <div
            className="modal-dialog modal-dialog-confirm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-icon-wrap">
              <AlertTriangle size={28} />
            </div>
            <h3>Remove Saved Location?</h3>
            <p>
              Are you sure you want to remove{" "}
              <strong>"{locationToDelete.name}"</strong> (
              {locationToDelete.thana}) from your saved areas? You will no
              longer receive neighborhood updates for this place.
            </p>
            <div className="confirm-modal-actions">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setLocationToDelete(null)}
                disabled={isDeletingLocation}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-modal-delete-danger"
                onClick={handleConfirmDelete}
                disabled={isDeletingLocation}
              >
                {isDeletingLocation ? (
                  <>
                    <span className="spinner-sm"></span>
                    <span>Removing...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>Yes, Remove</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE REPORT DETAIL MODAL (REUSING REPORTS PAGE UI) */}
      {activeReportModal && (
        <ReportDetailModal
          report={activeReportModal}
          onClose={() => setActiveReportModal(null)}
          onToast={showToast}
        />
      )}
    </div>
  );
}

export default SavedAreas;
