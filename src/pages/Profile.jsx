import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Edit3,
  HeartHandshake,
  Mail,
  MapPin,
  Phone,
  Plus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  ThumbsUp,
  Zap,
} from "lucide-react";
import "./Profile.css";

const initialUser = {
  name: "Fahim",
  fullName: "Fahim M.",
  email: "fahim@prohori.org",
  phone: "+880 1711-234567",
  primaryThana: "Dhanmondi Thana",
  joinedDate: "January 2025",
  role: "Verified Citizen Sentinel",
  reputationLevel: "Level 4 Sentinel",
  bio: "Active commuter in Dhanmondi & Gulshan. Committed to making Dhaka streets safer and well-monitored for everyone.",
};

const initialBadges = [
  {
    id: "b-1",
    name: "Dhaka Sentinel",
    icon: <ShieldCheck size={20} />,
    color: "#2563eb",
    bgColor: "#eff6ff",
    description: "Submitted 10+ verified community incident reports",
    earnedDate: "Feb 2025",
  },
  {
    id: "b-2",
    name: "Monsoon Guide",
    icon: <Sparkles size={20} />,
    color: "#0ea5e9",
    bgColor: "#f0f9ff",
    description: "Accurately mapped waterlogging choke points during rain",
    earnedDate: "May 2025",
  },
  {
    id: "b-3",
    name: "Rapid Spotter",
    icon: <Zap size={20} />,
    color: "#f59e0b",
    bgColor: "#fffbeb",
    description: "Reported an active hazard within 5 minutes of occurrence",
    earnedDate: "Jul 2025",
  },
  {
    id: "b-4",
    name: "Community Pillar",
    icon: <HeartHandshake size={20} />,
    color: "#6d4aff",
    bgColor: "#f5f3ff",
    description: "Received 150+ community confirmations on alerts",
    earnedDate: "Aug 2025",
  },
];

const initialMyReports = [
  {
    id: "rep-101",
    type: "Road accident & Traffic diversion",
    category: "Transportation",
    location: "Satmasjid Road, Dhanmondi",
    date: "August 18, 2026",
    status: "verified",
    upvotes: 34,
    views: 312,
  },
  {
    id: "rep-102",
    type: "Dislodged manhole lid after heavy rain",
    category: "Civic issue",
    location: "Dhanmondi Road 27",
    date: "August 12, 2026",
    status: "resolved",
    upvotes: 48,
    views: 520,
  },
  {
    id: "rep-103",
    type: "Streetlight malfunction near footbridge",
    category: "Public safety",
    location: "Kalabagan Lake Bridge",
    date: "July 29, 2026",
    status: "resolved",
    upvotes: 22,
    views: 180,
  },
];

function Profile() {
  const [user, setUser] = useState(initialUser);
  const [myReports] = useState(initialMyReports);
  const [toastMessage, setToastMessage] = useState("");

  // Edit Profile Modal
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editFullName, setEditFullName] = useState(user.fullName);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editBio, setEditBio] = useState(user.bio);
  const [editThana, setEditThana] = useState(user.primaryThana);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUser({
      ...user,
      name: editName,
      fullName: editFullName,
      phone: editPhone,
      bio: editBio,
      primaryThana: editThana,
    });
    setIsEditProfileOpen(false);
    showToast("Profile details updated successfully!");
  };

  return (
    <div className="profile-page">
      {/* TOAST */}
      {toastMessage && (
        <div className="profile-toast">
          <Sparkles size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER CARD */}
      <section className="profile-hero-card">
        <div className="hero-top-row">
          <div className="profile-avatar-large">
            <span>{user.name.charAt(0)}</span>
            <div className="avatar-status-badge" title="Active Sentinel">
              <ShieldCheck size={14} />
            </div>
          </div>

          <div className="hero-info">
            <div className="name-role-line">
              <h1>{user.fullName}</h1>
              <span className="role-tag">
                <Shield size={12} />
                {user.role}
              </span>
            </div>

            <p className="profile-bio">{user.bio}</p>

            <div className="profile-meta-chips">
              <span className="meta-chip">
                <MapPin size={13} />
                {user.primaryThana}
              </span>
              <span className="meta-chip">
                <Mail size={13} />
                {user.email}
              </span>
              <span className="meta-chip">
                <Phone size={13} />
                {user.phone}
              </span>
              <span className="meta-chip">
                <Calendar size={13} />
                Member since {user.joinedDate}
              </span>
            </div>
          </div>

          <button
            className="btn-edit-profile"
            onClick={() => setIsEditProfileOpen(true)}
          >
            <Edit3 size={15} />
            <span>Edit Profile</span>
          </button>
        </div>
      </section>

      {/* STATS ROW */}
      <div className="profile-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap blue">
            <ShieldAlert size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Reports Submitted</span>
            <strong className="stat-val">{myReports.length + 11}</strong>
            <small>100% verified incidents</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap purple">
            <ThumbsUp size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Helpful Confirmations</span>
            <strong className="stat-val">186</strong>
            <small>Citizens helped in Dhaka</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap green">
            <Award size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Safety Badges</span>
            <strong className="stat-val">{initialBadges.length}</strong>
            <small>Sentinel achievements</small>
          </div>
        </div>
      </div>

      {/* BADGES SECTION */}
      <section className="profile-section-card full-width">
        <div className="section-header">
          <div>
            <h2>Prohori Sentinel Badges</h2>
            <p>Achievements earned for accurate incident reporting in Dhaka.</p>
          </div>
        </div>

        <div className="badges-grid">
          {initialBadges.map((badge) => (
            <div className="badge-item" key={badge.id}>
              <div
                className="badge-icon-box"
                style={{
                  background: badge.bgColor,
                  color: badge.color,
                }}
              >
                {badge.icon}
              </div>
              <div className="badge-details">
                <div className="badge-title-line">
                  <strong>{badge.name}</strong>
                  <small>Earned {badge.earnedDate}</small>
                </div>
                <p>{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MY SUBMITTED REPORTS TIMELINE */}
      <section className="profile-section-card full-width">
        <div className="section-header">
          <div>
            <h2>My Incident Reporting History</h2>
            <p>
              Community safety reports you submitted across Dhaka city roads.
            </p>
          </div>
          <Link to="/report-incident" className="btn-new-report-link">
            <Plus size={14} />
            <span>Submit New Report</span>
          </Link>
        </div>

        <div className="my-reports-list">
          {myReports.map((report) => (
            <div className="my-report-row" key={report.id}>
              <div className="report-status-icon">
                {report.status === "resolved" ? (
                  <CheckCircle size={20} className="status-resolved" />
                ) : (
                  <ShieldAlert size={20} className="status-verified" />
                )}
              </div>

              <div className="report-main-info">
                <strong>{report.type}</strong>
                <div className="report-location-date">
                  <span>
                    <MapPin size={12} /> {report.location}
                  </span>
                  <span>·</span>
                  <span>
                    <Clock size={12} /> {report.date}
                  </span>
                </div>
              </div>

              <div className="report-impact">
                <span className="report-upvotes">
                  <ThumbsUp size={13} /> {report.upvotes} Confirmations
                </span>
                <span className={`status-pill ${report.status}`}>
                  {report.status === "resolved"
                    ? "Hazard Resolved"
                    : "Community Verified"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EDIT PROFILE MODAL */}
      {isEditProfileOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3>Edit Profile Information</h3>
              <button
                className="modal-close-btn"
                onClick={() => setIsEditProfileOpen(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="modal-form">
              <div className="form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Full Legal / Citizen Name</label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number (for SMS Alerts)</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Primary Thana</label>
                <select
                  value={editThana}
                  onChange={(e) => setEditThana(e.target.value)}
                >
                  <option value="Dhanmondi Thana">Dhanmondi Thana</option>
                  <option value="Gulshan Thana">Gulshan Thana</option>
                  <option value="Banani Thana">Banani Thana</option>
                  <option value="Mirpur Model Thana">Mirpur Model Thana</option>
                  <option value="Uttara East Thana">Uttara East Thana</option>
                  <option value="Mohammadpur Thana">Mohammadpur Thana</option>
                  <option value="Shahbagh Thana">Shahbagh Thana</option>
                </select>
              </div>
              <div className="form-group">
                <label>Short Bio</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setIsEditProfileOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
