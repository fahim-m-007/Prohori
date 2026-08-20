import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Camera, ChevronDown, MapPin, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

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

const geoapifyKey = import.meta.env.VITE_GEOAPIFY_KEY;

function findLocalLocations(query) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  return dhakaLocations
    .filter(({ name, detail }) => `${name} ${detail}`.toLocaleLowerCase().includes(normalizedQuery))
    .slice(0, 5);
}

function ReportIncident() {
  const [locationQuery, setLocationQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
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
      const parameters = new URLSearchParams({
        text: query,
        apiKey: geoapifyKey,
        filter: "rect:90.28,23.65,90.55,23.92|countrycode:bd",
        bias: "proximity:90.4125,23.8103",
        format: "json",
        limit: "5",
      });

      try {
        const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?${parameters}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Location search failed");

        const { results = [] } = await response.json();
        setSuggestions(results.map((result) => ({
          id: result.place_id,
          name: result.address_line1 || result.name || result.formatted,
          detail: result.address_line2 || result.formatted || "Dhaka, Bangladesh",
          coordinates: [result.lon, result.lat],
        })).filter(({ name }) => name));
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
    setShowSuggestions(false);
    setActiveSuggestion(-1);
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
        <form className="incident-form">
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
                <select defaultValue="">
                  <option value="" disabled>Select an incident type</option>
                  <option>Road accident</option>
                  <option>Waterlogging</option>
                  <option>Traffic disruption</option>
                  <option>Theft</option>
                  <option>Other</option>
                </select>
                <ChevronDown size={17} />
              </div>
            </label>

            <label>
              Description <span className="optional">(optional)</span>
              <textarea rows="5" placeholder="Tell us what you saw, including any useful details..." />
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
                  <button type="button">Use my location</button>
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
          </section>

          <section className="incident-form-section">
            <div className="form-section-heading">
              <span>03</span>
              <div>
                <h2>Add evidence</h2>
                <p>Photos can help others understand the situation.</p>
              </div>
            </div>

            <button type="button" className="photo-upload">
              <Camera size={22} />
              <strong>Add photos</strong>
              <span>Upload up to 3 images</span>
            </button>
          </section>

          <div className="incident-form-actions">
            <Link to="/dashboard" className="cancel-report">Cancel</Link>
            <button type="submit" className="submit-report">Submit report</button>
          </div>
        </form>

        <aside className="report-help-card">
          <ShieldAlert size={21} />
          <h2>Report responsibly</h2>
          <p>Only share information you believe is accurate. Do not include personal or sensitive details.</p>
          <Link to="/alerts">View active alerts</Link>
        </aside>
      </main>
    </div>
  );
}

export default ReportIncident;
