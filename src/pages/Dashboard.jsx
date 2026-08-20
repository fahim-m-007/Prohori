import {
  MapPin,
  AlertTriangle,
  ShieldCheck,
  Users,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";

import "./Dashboard.css";

function Dashboard() {
  return (
    <>
      {/* =========================================
          TOP BAR
      ========================================= */}

      <header className="dashboard-header">
        <div>
          <span className="dashboard-date">THURSDAY, AUGUST 21</span>

          <h1>Good morning, Fahim 👋</h1>

          <p>Here's what's happening around Dhaka.</p>
        </div>

        <div className="dashboard-header-actions">
          <button className="header-icon-btn">
            <MapPin size={18} />
          </button>

          <button className="header-icon-btn">
            <AlertTriangle size={18} />

            <span className="header-notification-dot"></span>
          </button>

          <div className="header-avatar">F</div>
        </div>
      </header>

      {/* =========================================
          STATS
      ========================================= */}

      <section className="dashboard-stats">
        {/* TOTAL REPORTS */}

        <div className="dashboard-stat-card">
          <div className="stat-card-top">
            <div className="dashboard-stat-icon blue">
              <MapPin size={19} />
            </div>

            <span className="stat-change positive">
              +12.5%
              <ArrowUpRight size={12} />
            </span>
          </div>

          <strong>1,284</strong>

          <span>Total reports</span>
        </div>

        {/* ACTIVE INCIDENTS */}

        <div className="dashboard-stat-card">
          <div className="stat-card-top">
            <div className="dashboard-stat-icon red">
              <AlertTriangle size={19} />
            </div>

            <span className="stat-change negative">
              +4.2%
              <ArrowUpRight size={12} />
            </span>
          </div>

          <strong>86</strong>

          <span>Active incidents</span>
        </div>

        {/* SAFETY SCORE */}

        <div className="dashboard-stat-card">
          <div className="stat-card-top">
            <div className="dashboard-stat-icon green">
              <ShieldCheck size={19} />
            </div>

            <span className="stat-change positive">
              +8.1%
              <ArrowUpRight size={12} />
            </span>
          </div>

          <strong>82%</strong>

          <span>Safety score</span>
        </div>

        {/* COMMUNITY */}

        <div className="dashboard-stat-card">
          <div className="stat-card-top">
            <div className="dashboard-stat-icon purple">
              <Users size={19} />
            </div>

            <span className="stat-change positive">
              +18.4%
              <ArrowUpRight size={12} />
            </span>
          </div>

          <strong>2.4K</strong>

          <span>Community members</span>
        </div>
      </section>

      {/* =========================================
          MAIN GRID
      ========================================= */}

      <section className="dashboard-grid">
        {/* =====================================
            MAP CARD
        ===================================== */}

        <div className="dashboard-map-card">
          <div className="card-header">
            <div>
              <span className="card-label">LIVE OVERVIEW</span>

              <h2>Dhaka Safety Map</h2>
            </div>

            <button className="more-btn">
              <MoreHorizontal size={19} />
            </button>
          </div>

          {/* MAP */}

          <div className="dashboard-map">
            <div className="map-grid"></div>

            <div className="dash-road dash-road-1"></div>

            <div className="dash-road dash-road-2"></div>

            <div className="dash-road dash-road-3"></div>

            {/* HIGH RISK */}

            <div className="dash-marker high">
              <span></span>
            </div>

            {/* WARNING */}

            <div className="dash-marker warning">
              <span></span>
            </div>

            {/* SAFE */}

            <div className="dash-marker safe">
              <span></span>
            </div>

            {/* ANOTHER HIGH RISK */}

            <div className="dash-marker high marker-four">
              <span></span>
            </div>

            {/* LOCATION */}

            <div className="map-center-label">
              <MapPin size={14} />
              Dhaka
            </div>

            {/* EXPLORE */}

            <button className="expand-map-btn">
              Explore Live Map
              <ArrowUpRight size={14} />
            </button>
          </div>

          {/* MAP LEGEND */}

          <div className="map-legend">
            <span>
              <i className="legend-red"></i>
              High risk
            </span>

            <span>
              <i className="legend-orange"></i>
              Caution
            </span>

            <span>
              <i className="legend-green"></i>
              Safer
            </span>
          </div>
        </div>

        {/* =====================================
            ACTIVE ALERTS
        ===================================== */}

        <div className="dashboard-alerts">
          <div className="card-header">
            <div>
              <span className="card-label">IMPORTANT</span>

              <h2>Active Alerts</h2>
            </div>

            <button className="view-all-btn">View all</button>
          </div>

          <div className="alert-list">
            {/* ALERT 1 */}

            <div className="dashboard-alert">
              <div className="alert-icon danger">
                <AlertTriangle size={17} />
              </div>

              <div className="alert-content">
                <strong>Road accident</strong>

                <span>Airport Road</span>

                <small>8 min ago</small>
              </div>

              <span className="alert-arrow">→</span>
            </div>

            {/* ALERT 2 */}

            <div className="dashboard-alert">
              <div className="alert-icon warning">
                <MapPin size={17} />
              </div>

              <div className="alert-content">
                <strong>Heavy waterlogging</strong>

                <span>Mirpur 10</span>

                <small>23 min ago</small>
              </div>

              <span className="alert-arrow">→</span>
            </div>

            {/* ALERT 3 */}

            <div className="dashboard-alert">
              <div className="alert-icon info">
                <MapPin size={17} />
              </div>

              <div className="alert-content">
                <strong>Traffic disruption</strong>

                <span>Farmgate</span>

                <small>41 min ago</small>
              </div>

              <span className="alert-arrow">→</span>
            </div>

            {/* ALERT 4 */}

            <div className="dashboard-alert">
              <div className="alert-icon success">
                <ShieldCheck size={17} />
              </div>

              <div className="alert-content">
                <strong>Area cleared</strong>

                <span>Dhanmondi 27</span>

                <small>1 hr ago</small>
              </div>

              <span className="alert-arrow">→</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          RECENT REPORTS
      ========================================= */}

      <section className="recent-reports">
        <div className="card-header">
          <div>
            <span className="card-label">COMMUNITY</span>

            <h2>Recent Reports</h2>
          </div>

          <button className="view-all-btn">View all reports</button>
        </div>

        <div className="reports-table">
          {/* TABLE HEADER */}

          <div className="report-row report-heading">
            <span>INCIDENT</span>

            <span>LOCATION</span>

            <span>STATUS</span>

            <span>REPORTED</span>
          </div>

          {/* REPORT 1 */}

          <div className="report-row">
            <div className="report-name">
              <div className="report-type red-bg">
                <AlertTriangle size={15} />
              </div>

              <div>
                <strong>Road accident</strong>

                <span>Transportation</span>
              </div>
            </div>

            <span>Gulshan 1</span>

            <span className="status verified">Verified</span>

            <span>12 min ago</span>
          </div>

          {/* REPORT 2 */}

          <div className="report-row">
            <div className="report-name">
              <div className="report-type orange-bg">
                <MapPin size={15} />
              </div>

              <div>
                <strong>Waterlogging</strong>

                <span>Civic issue</span>
              </div>
            </div>

            <span>Mirpur 10</span>

            <span className="status pending">Pending</span>

            <span>28 min ago</span>
          </div>

          {/* REPORT 3 */}

          <div className="report-row">
            <div className="report-name">
              <div className="report-type purple-bg">
                <AlertTriangle size={15} />
              </div>

              <div>
                <strong>Suspicious activity</strong>

                <span>Public safety</span>
              </div>
            </div>

            <span>Dhanmondi</span>

            <span className="status verified">Verified</span>

            <span>42 min ago</span>
          </div>
        </div>
      </section>
    </>
  );
}

export default Dashboard;
