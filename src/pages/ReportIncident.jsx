import { useEffect, useMemo, useRef, useState } from "react";
import { CircleMarker, MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  ChevronDown,
  Map as MapIcon,
  MapPin,
  ShieldAlert,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useReports } from "../context/ReportsContext";

import "leaflet/dist/leaflet.css";
import "./ReportIncident.css";

const dhakaLocations = [
  { name: "Gulshan 1 Circle", detail: "Gulshan, Dhaka" },
  { name: "Gulshan 2 Circle", detail: "Gulshan, Dhaka" },
  { name: "Mirpur 10 Roundabout", detail: "Mirpur, Dhaka" },
  { name: "Farmgate", detail: "Tejgaon, Dhaka" },
  { name: "Dhanmondi 27", detail: "Dhanmondi, Dhaka" },
  { name: "Hazrat Shahjalal International Airport", detail: "Airport Road, Dhaka" },
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
const DHAKA_BOUNDS = [[23.65, 90.28], [23.92, 90.55]];

function findLocalLocations(query) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  return dhakaLocations
    .filter(({ name, detail }) => `${name} ${detail}`.toLocaleLowerCase().includes(normalizedQuery))
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
        attribution={'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
      />
      <MapClickHandler onPick={onPick} />
      {position && <CircleMarker center={position} radius={9} pathOptions={{ color: "white", fillColor: "#2563eb", fillOpacity: 1, weight: 4 }} />}
    </MapContainer>
  );
}

function ReportIncident() {
  const navigate = useNavigate();
  const { createReport } = useReports();

  // Form states
  const [incidentType, setIncidentType] = useState("");
  const [title, setTitle] = useState("");
  const [severity, setSeverity] = useState("caution");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const photoInputRef = useRef(null);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = 3 - photos.length;
    if (remainingSlots <= 0) return;

    const selectedFiles = files.slice(0, remainingSlots);

    selectedFiles.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Only image files are allowed.");
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        setErrorMessage("Images should be smaller than 4MB each.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotos((prev) => {
          if (prev.length >= 3) return prev;
          return [
            ...prev,
            {
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              dataUrl: event.target.result,
              name: file.name,
            },
          ];
        });
      };
      reader.readAsDataURL(file);
    });

    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  const removePhoto = (photoId) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!incidentType) {
      setErrorMessage("Please select an incident type.");
      return;
    }

    if (!thanaSearch.trim()) {
      setErrorMessage("Please select or enter a Thana area.");
      return;
    }

    if (!locationQuery.trim()) {
      setErrorMessage("Please provide a location detail or landmark.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: title.trim() || `${incidentType} at ${locationQuery.trim()}`,
        category: incidentType,
        severity,
        thana: thanaSearch.trim(),
        location: locationQuery.trim(),
        description: description.trim(),
        position: locationCoordinates || undefined,
        images: photos.map((p) => p.dataUrl),
      };

      await createReport(payload);
      setSuccessMessage("Incident report submitted successfully! Redirecting to feed...");
      setTimeout(() => {
        navigate("/reports");
      }, 1000);
    } catch (err) {
      console.error("Failed to submit incident report:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to submit incident report. Please try again.";
      setErrorMessage(message);
      setIsSubmitting(false);
    }
  };

  // Thana Dropdown states
  const [thanaSearch, setThanaSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const thanaDropdownRef = useRef(null);
  const thanaListRef = useRef(null);

  const filteredThanas = thanaList.filter((t) =>
    t.toLowerCase().includes(thanaSearch.toLowerCase())
  );

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (thanaDropdownRef.current && !thanaDropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isDropdownOpen && thanaListRef.current && highlightedIndex >= 0) {
      const items = thanaListRef.current.querySelectorAll(".custom-dropdown-item");
      if (items[highlightedIndex]) {
        items[highlightedIndex].scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isDropdownOpen]);

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
          prev < filteredThanas.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isDropdownOpen) {
        setIsDropdownOpen(true);
        setHighlightedIndex(filteredThanas.length - 1);
      } else if (filteredThanas.length > 0) {
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredThanas.length - 1
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

  const [locationQuery, setLocationQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [locationCoordinates, setLocationCoordinates] = useState(null);
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const displayedSuggestions = useMemo(
    () => (geoapifyKey ? suggestions : findLocalLocations(locationQuery)),
    [locationQuery, suggestions],
  );

  useEffect(() => {
    const query = locationQuery.trim();
    if (!query || !geoapifyKey) return undefined;

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsSearching(true);
      const searchLocations = async (text, filter, bias) => {
        const parameters = new URLSearchParams({
          text,
          apiKey: geoapifyKey,
          filter,
          bias,
          format: "json",
          limit: "5",
        });
        const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?${parameters}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Location search failed");

        const { results = [] } = await response.json();
        return results.map((result) => ({
          id: result.place_id,
          name: result.address_line1 || result.name || result.formatted,
          detail: result.address_line2 || result.formatted || "Dhaka, Bangladesh",
          coordinates: [result.lat, result.lon],
        })).filter(({ name }) => name);
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
        if (error.name !== "AbortError") setSuggestions(findLocalLocations(query));
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, 350);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [locationQuery]);

  const selectLocation = (location) => {
    setLocationQuery(`${location.name}, ${location.detail}`);
    setLocationCoordinates(location.coordinates || null);
    setShowSuggestions(false);
    setActiveSuggestion(-1);
  };

  const selectMapLocation = (coordinates) => {
    setLocationCoordinates(coordinates);
    setLocationQuery(`Pinned location · ${coordinates[0].toFixed(5)}, ${coordinates[1].toFixed(5)}`);
    setShowSuggestions(false);
    setLocationMessage("Location pinned on the map.");
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("Your browser does not support location access. Pick a spot on the map instead.");
      return;
    }

    setLocationMessage("Finding your location...");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        selectMapLocation([coords.latitude, coords.longitude]);
        setIsMapPickerOpen(true);
      },
      () => setLocationMessage("We could not access your location. Please allow permission or pin a spot on the map."),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleLocationKeyDown = (event) => {
    if (!displayedSuggestions.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveSuggestion((current) => (current + 1) % displayedSuggestions.length);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSuggestion((current) => (current - 1 + displayedSuggestions.length) % displayedSuggestions.length);
    }

    if (event.key === "Enter" && activeSuggestion >= 0) {
      event.preventDefault();
      selectLocation(displayedSuggestions[activeSuggestion]);
    }

    if (event.key === "Escape") setShowSuggestions(false);
  };

  return (
    <div className="report-incident-page">
      <header className="report-incident-header">
        <div>
          <Link to="/dashboard" className="back-link">
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>
          <span className="report-eyebrow">COMMUNITY SAFETY</span>
          <h1>Report an incident</h1>
          <p>Share what happened to help keep your community informed and safe.</p>
        </div>
        <div className="report-header-icon"><ShieldAlert size={21} /></div>
      </header>

      <main className="report-incident-content">
        <form className="incident-form" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="report-alert-box error" role="alert">
              <AlertTriangle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="report-alert-box success" role="status">
              <CheckCircle2 size={16} />
              <span>{successMessage}</span>
            </div>
          )}

          <section className="incident-form-section">
            <div className="form-section-heading">
              <span>01</span>
              <div>
                <h2>What happened?</h2>
                <p>Choose the incident type and add a short description.</p>
              </div>
            </div>

            <label>
              Incident type
              <div className="select-wrap">
                <select
                  value={incidentType}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setIncidentType(selected);
                    const highCats = [
                      "Road accident",
                      "Theft",
                      "Mugging",
                      "Violence",
                      "Hijacking",
                      "Fire & Explosion",
                    ];
                    setSeverity(highCats.includes(selected) ? "high" : "caution");
                  }}
                  required
                >
                  <option value="" disabled>Select an incident type</option>
                  <option value="Road accident">Road accident</option>
                  <option value="Traffic disruption">Traffic disruption</option>
                  <option value="Waterlogging">Waterlogging</option>
                  <option value="Theft">Theft</option>
                  <option value="Mugging">Mugging</option>
                  <option value="Violence">Violence</option>
                  <option value="Hijacking">Hijacking</option>
                  <option value="Fire & Explosion">Fire &amp; Explosion</option>
                  <option value="Protest Blockade">Protest Blockade</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown size={17} />
              </div>
            </label>

            <label>
              Report title <span className="optional">(optional)</span>
              <input
                type="text"
                placeholder="e.g. Severe waterlogging blocking Kazipara lane"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
              />
            </label>

            <label>
              Urgency / Severity
              <div className="select-wrap">
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                >
                  <option value="caution">Caution - Moderate impact / Hazard</option>
                  <option value="high">High Risk - Urgent / Danger / Gridlock</option>
                  <option value="low">Low - Minor issue</option>
                </select>
                <ChevronDown size={17} />
              </div>
            </label>

            <label>
              Description <span className="optional">(optional)</span>
              <textarea
                rows="5"
                placeholder="Tell us what you saw, including any useful details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
          </section>

          <section className="incident-form-section">
            <div className="form-section-heading">
              <span>02</span>
              <div>
                <h2>Where is it?</h2>
                <p>Use your current location or enter the location manually.</p>
              </div>
            </div>

            <div className="thana-dropdown-field" ref={thanaDropdownRef}>
              <label htmlFor="incident-thana">Thana</label>
              <div className="dropdown-input-wrapper">
                <input 
                  id="incident-thana" 
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
                    if (highlightedIndex === -1 && filteredThanas.length > 0) {
                      setHighlightedIndex(0);
                    }
                  }}
                  onClick={() => setIsDropdownOpen(true)}
                  onKeyDown={handleThanaKeyDown}
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
                  <ChevronDown size={16} className={`dropdown-chevron ${isDropdownOpen ? "open" : ""}`} />
                </button>
              </div>
              {isDropdownOpen && (
                <div className="custom-dropdown-menu" ref={thanaListRef} role="listbox">
                  {filteredThanas.length > 0 ? (
                    filteredThanas.map((thana, index) => (
                      <div 
                        key={thana} 
                        role="option"
                        aria-selected={highlightedIndex === index}
                        className={`custom-dropdown-item ${highlightedIndex === index ? "highlighted" : ""}`}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        onClick={() => handleSelectThana(thana)}
                      >
                        {thana}
                      </div>
                    ))
                  ) : (
                    <div className="custom-dropdown-empty">No thanas found</div>
                  )}
                </div>
              )}
            </div>

            <label>
              Location
              <div className="location-autocomplete">
                <div className="location-input">
                  <MapPin size={18} />
                  <input
                    type="text"
                    value={locationQuery}
                    placeholder="Search an area, road, or landmark"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={showSuggestions && locationQuery.trim().length > 0}
                    aria-controls="location-suggestions"
                    onChange={(event) => {
                      setLocationQuery(event.target.value);
                      setShowSuggestions(true);
                      setActiveSuggestion(-1);
                      setSuggestions([]);
                      setIsSearching(false);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={handleLocationKeyDown}
                  />
                  <button type="button" onClick={useCurrentLocation}>Use my location</button>
                </div>
                {showSuggestions && locationQuery.trim() && (
                  <ul className="location-suggestions" id="location-suggestions" role="listbox">
                    {isSearching && <li className="location-search-message">Finding locations in Dhaka...</li>}
                    {!isSearching && displayedSuggestions.map((location, index) => (
                      <li key={location.name} role="option" aria-selected={index === activeSuggestion}>
                        <button
                          type="button"
                          className={index === activeSuggestion ? "active" : ""}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => selectLocation(location)}
                        >
                          <MapPin size={16} />
                          <span><strong>{location.name}</strong><small>{location.detail}</small></span>
                        </button>
                      </li>
                    ))}
                    {!isSearching && displayedSuggestions.length === 0 && (
                      <li className="location-search-message">No Dhaka locations found. Try an area, road, or landmark.</li>
                    )}
                    {geoapifyKey && !isSearching && displayedSuggestions.length > 0 && (
                      <li className="location-search-attribution">Search powered by Geoapify</li>
                    )}
                  </ul>
                )}
              </div>
            </label>

            <div className="location-map-actions">
              <button type="button" onClick={() => setIsMapPickerOpen((open) => !open)}>
                <MapIcon size={15} />
                {isMapPickerOpen ? "Hide map" : "Pick a location on the map"}
              </button>
              <span>Can&apos;t find the exact place?</span>
            </div>

            {locationMessage && <p className="location-message">{locationMessage}</p>}

            {isMapPickerOpen && (
              <div className="location-picker">
                <div className="location-picker-heading">
                  <div>
                    <strong>Pin the incident location</strong>
                    <span>Click anywhere on the Dhaka map to set the pin.</span>
                  </div>
                  <button type="button" aria-label="Close location map" onClick={() => setIsMapPickerOpen(false)}><X size={16} /></button>
                </div>
                <LocationMapPicker position={locationCoordinates} onPick={selectMapLocation} />
              </div>
            )}
          </section>

          <section className="incident-form-section">
            <div className="form-section-heading">
              <span>03</span>
              <div>
                <h2>Add evidence</h2>
                <p>Photos can help others understand the situation.</p>
              </div>
            </div>

            <input
              type="file"
              ref={photoInputRef}
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              style={{ display: "none" }}
            />

            {photos.length < 3 && (
              <button
                type="button"
                className="photo-upload"
                onClick={() => photoInputRef.current?.click()}
              >
                <Camera size={22} />
                <strong>Add photos</strong>
                <span>Upload up to 3 images ({3 - photos.length} remaining)</span>
              </button>
            )}

            {photos.length > 0 && (
              <div className="photo-preview-grid">
                {photos.map((photo) => (
                  <div key={photo.id} className="photo-preview-item">
                    <img src={photo.dataUrl} alt={photo.name || "Incident evidence"} />
                    <button
                      type="button"
                      className="photo-remove-btn"
                      onClick={() => removePhoto(photo.id)}
                      aria-label="Remove photo"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="incident-form-actions">
            <Link to="/dashboard" className="cancel-report">Cancel</Link>
            <button
              type="submit"
              className="submit-report"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-sm"></span>
                  <span>Submitting...</span>
                </>
              ) : (
                "Submit report"
              )}
            </button>
          </div>
        </form>

        <aside className="report-help-card">
          <ShieldAlert size={21} />
          <h2>Report responsibly</h2>
          <p>Only share information you believe is accurate. Do not include personal or sensitive details.</p>
          <Link to="/reports">View active reports</Link>
        </aside>
      </main>
    </div>
  );
}

export default ReportIncident;
