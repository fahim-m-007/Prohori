import { useNavigate } from "react-router-dom";
import "./Landing.css";

import { ArrowRight, MapPin, ShieldCheck } from "lucide-react";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* ================= NAVBAR ================= */}

      <nav className="navbar">
        {/* LOGO */}

        <button className="logo" onClick={() => navigate("/")} type="button">
          <div className="logo-mark">P</div>

          <span>PROHORI</span>
        </button>

        {/* NAVIGATION */}

        <div className="nav-links">
          <a href="#home" className="active">
            Home
          </a>

          <a href="#how-it-works">How It Works</a>

          <button type="button" onClick={() => navigate("/map")}>
            Live Map
          </button>

          <a href="#about">About</a>
        </div>

        {/* NAV ACTIONS */}

        <div className="nav-actions">
          <button
            className="login-btn"
            type="button"
            onClick={() => navigate("/dashboard")}
          >
            Log in
          </button>

          <button
            className="nav-report-btn"
            type="button"
            onClick={() => navigate("/reports")}
          >
            Report Incident
          </button>
        </div>
      </nav>

      {/* ================= HERO ================= */}

      <main id="home" className="hero">
        {/* HERO CONTENT */}

        <div className="hero-content">
          <div className="hero-badge">
            <span className="status-dot"></span>
            Live safety information for Dhaka
          </div>

          <h1>
            Know the road
            <br />
            <span>before you take it.</span>
          </h1>

          <p className="hero-description">
            PROHORI connects Dhaka's communities through real-time safety
            reports, helping you make smarter decisions about where you travel.
          </p>

          {/* HERO BUTTONS */}

          <div className="hero-buttons">
            <button
              className="primary-btn"
              type="button"
              onClick={() => navigate("/map")}
            >
              Explore Live Map
              <ArrowRight size={18} />
            </button>

            <button
              className="secondary-btn"
              type="button"
              onClick={() => navigate("/reports")}
            >
              Report an Incident
            </button>
          </div>

          {/* TRUST */}

          <div className="hero-trust">
            <div className="trust-icon">
              <ShieldCheck size={18} />
            </div>

            <span>Community-powered safety information</span>
          </div>
        </div>

        {/* ================= HERO VISUAL ================= */}

        <div className="hero-visual">
          {/* MAP CARD */}

          <div className="map-card">
            <div className="map-header">
              <div>
                <span className="map-label">LIVE MAP</span>

                <h3>Dhaka Safety Overview</h3>
              </div>

              <div className="map-status">
                <span></span>
                Live
              </div>
            </div>

            {/* FAKE MAP */}

            <div className="fake-map">
              <div className="map-grid"></div>

              <div className="road road-one"></div>

              <div className="road road-two"></div>

              <div className="road road-three"></div>

              {/* RED MARKER */}

              <div className="map-marker marker-red">
                <MapPin size={17} />
              </div>

              {/* ORANGE MARKER */}

              <div className="map-marker marker-orange">
                <MapPin size={17} />
              </div>

              {/* GREEN MARKER */}

              <div className="map-marker marker-green">
                <MapPin size={17} />
              </div>

              {/* BLUE MARKER */}

              <div className="map-marker marker-blue">
                <MapPin size={17} />
              </div>

              {/* LOCATION */}

              <div className="map-location">
                <MapPin size={15} />
                Dhaka
              </div>
            </div>

            {/* MAP FOOTER */}

            <div className="map-footer">
              <div className="map-stat">
                <span className="stat-color red"></span>
                High Risk
              </div>

              <div className="map-stat">
                <span className="stat-color orange"></span>
                Caution
              </div>

              <div className="map-stat">
                <span className="stat-color green"></span>
                Safer
              </div>
            </div>
          </div>

          {/* REPORTS FLOATING CARD */}

          <div className="floating-card reports-card">
            <div className="floating-icon blue-icon">
              <MapPin size={18} />
            </div>

            <div>
              <strong>1,284</strong>

              <span>Community reports</span>
            </div>
          </div>

          {/* SAFETY FLOATING CARD */}

          <div className="floating-card safety-card">
            <div className="safety-circle">82</div>

            <div>
              <strong>Good</strong>

              <span>Overall safety</span>
            </div>
          </div>
        </div>
      </main>

      {/* ================= STATS ================= */}

      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <strong>1.2K+</strong>

            <span>Community Reports</span>
          </div>

          <div className="stat-divider"></div>

          <div className="stat-item">
            <strong>50+</strong>

            <span>Areas Covered</span>
          </div>

          <div className="stat-divider"></div>

          <div className="stat-item">
            <strong>24/7</strong>

            <span>Safety Updates</span>
          </div>

          <div className="stat-divider"></div>

          <div className="stat-item">
            <strong>100%</strong>

            <span>Community Driven</span>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section id="how-it-works" className="how-section">
        <div className="section-heading">
          <span className="section-label">HOW PROHORI WORKS</span>

          <h2>
            From information
            <br />
            to safer decisions.
          </h2>

          <p>
            A simple way for the people of Dhaka to share, discover and respond
            to local safety concerns.
          </p>
        </div>

        <div className="steps">
          {/* STEP 01 */}

          <div className="step-card">
            <span className="step-number">01</span>

            <h3>Report</h3>

            <p>Share incidents and civic issues happening around you.</p>
          </div>

          {/* STEP 02 */}

          <div className="step-card">
            <span className="step-number">02</span>

            <h3>Verify</h3>

            <p>
              Community members help identify reliable and useful information.
            </p>
          </div>

          {/* STEP 03 */}

          <div className="step-card">
            <span className="step-number">03</span>

            <h3>Discover</h3>

            <p>Explore incidents and safety patterns across Dhaka.</p>
          </div>

          {/* STEP 04 */}

          <div className="step-card">
            <span className="step-number">04</span>

            <h3>Travel Smarter</h3>

            <p>Make better-informed decisions before heading out.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
