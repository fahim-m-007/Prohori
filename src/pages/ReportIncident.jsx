import { ArrowLeft, Camera, ChevronDown, MapPin, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

import "./ReportIncident.css";

function ReportIncident() {
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
              <div className="location-input">
                <MapPin size={18} />
                <input type="text" placeholder="Search for an area or address" />
                <button type="button">Use my location</button>
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
