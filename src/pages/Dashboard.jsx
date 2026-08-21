import {
  AlertTriangle,
  ArrowRight,
  Bell,
  FileText,
  Flag,
  MapPin,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";

import "./Dashboard.css";

function Dashboard() {
  const selectedThana = "Dhanmondi Thana";

  return (
    <div className="dashboard-page">

      {/* HEADER */}
      <header className="dashboard-header">
        <div>
          <span className="dashboard-label">COMMUNITY SAFETY</span>
          <h1>Good morning, Fahim 👋</h1>
          <p>See what&apos;s happening in your selected area.</p>
        </div>

        <div className="dashboard-actions">
          <button className="header-button" aria-label="Alerts">
            <Bell size={18} />
            <span className="notification-dot"></span>
          </button>

          <div className="header-avatar">F</div>
        </div>
      </header>


      <main className="dashboard-content">

        {/* SELECTED THANA */}
        <section className="thana-card">
          <div>
            <span className="section-label">
              <MapPin size={13} />
              SELECTED AREA
            </span>

            <h2>{selectedThana}</h2>

            <p>
              Reports and safety alerts from your selected thana.
            </p>
          </div>

          <div className="thana-count">
            <strong>6</strong>
            <span>reports<br />nearby</span>
          </div>

          <button className="thana-select">
            {selectedThana}
            <span>⌄</span>
          </button>
        </section>


        {/* MAIN CONTENT */}
        <section className="dashboard-grid">

          {/* RECENT REPORTS */}
          <div className="dashboard-card reports-card">

            <div className="card-header">
              <div>
                <span className="card-label">FROM YOUR AREA</span>
                <h2>Recent Reports</h2>
              </div>

              <Link to="/reports" className="view-link">
                View all
                <ArrowRight size={12} />
              </Link>
            </div>


            <div className="report-item">
              <div className="report-icon red">
                <AlertTriangle size={18} />
              </div>

              <div className="report-content">
                <div className="report-top">
                  <strong>Road accident</strong>
                  <small>12 min ago</small>
                </div>

                <span className="report-location">
                  <MapPin size={11} />
                  Satmasjid Road
                </span>

                <span className="report-category">
                  Transportation
                </span>

                <p>
                  Traffic is moving slowly near the intersection.
                </p>

                <div className="report-actions">
                  <button>View report</button>

                  <button className="flag-button">
                    <Flag size={12} />
                    Flag
                  </button>
                </div>
              </div>
            </div>


            <div className="report-item">
              <div className="report-icon orange">
                <MapPin size={18} />
              </div>

              <div className="report-content">
                <div className="report-top">
                  <strong>Heavy waterlogging</strong>
                  <small>31 min ago</small>
                </div>

                <span className="report-location">
                  <MapPin size={11} />
                  Dhanmondi 27
                </span>

                <span className="report-category">
                  Civic issue
                </span>

                <p>
                  Water accumulation reported around the road.
                </p>

                <div className="report-actions">
                  <button>View report</button>

                  <button className="flag-button">
                    <Flag size={12} />
                    Flag
                  </button>
                </div>
              </div>
            </div>


            <div className="report-item">
              <div className="report-icon blue">
                <AlertTriangle size={18} />
              </div>

              <div className="report-content">
                <div className="report-top">
                  <strong>Traffic disruption</strong>
                  <small>48 min ago</small>
                </div>

                <span className="report-location">
                  <MapPin size={11} />
                  Dhanmondi Lake
                </span>

                <span className="report-category">
                  Transportation
                </span>

                <p>
                  Traffic disruption reported near the main entrance.
                </p>

                <div className="report-actions">
                  <button>View report</button>

                  <button className="flag-button">
                    <Flag size={12} />
                    Flag
                  </button>
                </div>
              </div>
            </div>


            <div className="report-item">
              <div className="report-icon purple">
                <AlertTriangle size={18} />
              </div>

              <div className="report-content">
                <div className="report-top">
                  <strong>Damaged road</strong>
                  <small>1 hr ago</small>
                </div>

                <span className="report-location">
                  <MapPin size={11} />
                  Dhanmondi 8A
                </span>

                <span className="report-category">
                  Civic issue
                </span>

                <p>
                  Road surface is damaged and difficult to use.
                </p>

                <div className="report-actions">
                  <button>View report</button>

                  <button className="flag-button">
                    <Flag size={12} />
                    Flag
                  </button>
                </div>
              </div>
            </div>

          </div>


          {/* RIGHT SIDE */}
          <div className="dashboard-side">

            {/* AREA ALERTS */}
            <div className="dashboard-card">

              <div className="card-header">
                <div>
                  <span className="card-label">IMPORTANT</span>
                  <h2>Area Alerts</h2>
                </div>

                <span className="alert-count">3</span>
              </div>


              <div className="alert-item">
                <div className="small-icon red">
                  <AlertTriangle size={14} />
                </div>

                <div>
                  <strong>Heavy traffic</strong>
                  <span>Satmasjid Road</span>
                  <small>High traffic disruption reported</small>
                </div>
              </div>


              <div className="alert-item">
                <div className="small-icon orange">
                  <MapPin size={14} />
                </div>

                <div>
                  <strong>Waterlogging</strong>
                  <span>Dhanmondi 27</span>
                  <small>Avoid the area if possible</small>
                </div>
              </div>


              <div className="alert-item">
                <div className="small-icon purple">
                  <AlertTriangle size={14} />
                </div>

                <div>
                  <strong>Public safety</strong>
                  <span>Dhanmondi Lake</span>
                  <small>Multiple reports received</small>
                </div>
              </div>


              <Link to="/alerts" className="side-link">
                View all alerts
                <ArrowRight size={12} />
              </Link>

            </div>


            {/* MY REPORTS */}
            <div className="dashboard-card">

              <div className="card-header">
                <div>
                  <span className="card-label">YOUR ACTIVITY</span>
                  <h2>My Reports</h2>
                </div>

                <Link to="/reports" className="view-link">
                  View all
                </Link>
              </div>


              <div className="my-report">
                <div className="small-icon red">
                  <FileText size={14} />
                </div>

                <div>
                  <strong>Road accident</strong>
                  <span>Dhanmondi</span>
                </div>

                <small>Submitted</small>
              </div>


              <div className="my-report">
                <div className="small-icon orange">
                  <FileText size={14} />
                </div>

                <div>
                  <strong>Waterlogging</strong>
                  <span>Mirpur</span>
                </div>

                <small>Submitted</small>
              </div>


              <div className="my-report">
                <div className="small-icon purple">
                  <FileText size={14} />
                </div>

                <div>
                  <strong>Damaged road</strong>
                  <span>Gulshan</span>
                </div>

                <small>Submitted</small>
              </div>

            </div>

          </div>

        </section>


        {/* REPORT CTA */}
        <section className="report-card">

          <div className="report-plus">
            <Plus size={19} />
          </div>

          <div className="report-card-text">
            <span className="card-label">HELP YOUR COMMUNITY</span>
            <h2>See something that matters?</h2>
            <p>Report a safety or civic issue in your area.</p>
          </div>

          <Link to="/report-incident">
            Report an incident
            <ArrowRight size={13} />
          </Link>

        </section>

      </main>
    </div>
  );
}

export default Dashboard;