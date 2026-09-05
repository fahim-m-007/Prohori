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
import { useAuth } from "../context/AuthContext";

const initialUser = {
  name: "Fahim",
  fullName: "Fahim M.",
  email: "fahim@prohori.org",
  phone: "+880 1711-234567",
  primaryThana: "Dhanmondi",
  joinedDate: "January 2025",
  role: "Verified Citizen Sentinel",
  reputationLevel: "Level 4 Sentinel",
  bio: "Active commuter in Dhanmondi. Committed to making Dhaka streets safer and well-monitored for everyone.",
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
  const { user: authUser } = useAuth();
  const [customProfile, setCustomProfile] = useState(null);

  const primaryThana = customProfile?.primaryThana || authUser?.thana || initialUser.primaryThana;
  const name = customProfile?.name || authUser?.name || initialUser.name;
  const fullName = customProfile?.fullName || authUser?.name || initialUser.fullName;
  const email = customProfile?.email || authUser?.email || initialUser.email;
  const bio = customProfile?.bio || authUser?.bio || (primaryThana
    ? `Active commuter in ${primaryThana}. Committed to making Dhaka streets safer and well-monitored for everyone.`
    : initialUser.bio);

  const user = {
    ...initialUser,
    name,
    fullName,
    email,
    primaryThana,
    bio,
    phone: customProfile?.phone || initialUser.phone,
  };

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

  const handleOpenEdit = () => {
    setEditName(user.name);
    setEditFullName(user.fullName);
    setEditPhone(user.phone);
    setEditBio(user.bio);
    setEditThana(user.primaryThana);
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setCustomProfile({
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
            onClick={handleOpenEdit}
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
                  <option value="Adabor">Adabor</option>
                  <option value="Airport / Bimanbandar">Airport / Bimanbandar</option>
                  <option value="Badda">Badda</option>
                  <option value="Banani">Banani</option>
                  <option value="Bangshal">Bangshal</option>
                  <option value="Bhashantek">Bhashantek</option>
                  <option value="Cantonment">Cantonment</option>
                  <option value="Chalkbazar">Chalkbazar</option>
                  <option value="Dakshinkhan">Dakshinkhan</option>
                  <option value="Darus-Salam">Darus-Salam</option>
                  <option value="Demra">Demra</option>
                  <option value="Dhanmondi">Dhanmondi</option>
                  <option value="Gandaria">Gandaria</option>
                  <option value="Gulshan">Gulshan</option>
                  <option value="Hatirjheel">Hatirjheel</option>
                  <option value="Hazaribagh">Hazaribagh</option>
                  <option value="Jatrabari">Jatrabari</option>
                  <option value="Kadamtoli">Kadamtoli</option>
                  <option value="Kafrul">Kafrul</option>
                  <option value="Kalabagan">Kalabagan</option>
                  <option value="Kamrangirchar">Kamrangirchar</option>
                  <option value="Khilgaon">Khilgaon</option>
                  <option value="Khilkhet">Khilkhet</option>
                  <option value="Kotwali">Kotwali</option>
                  <option value="Lalbagh">Lalbagh</option>
                  <option value="Mirpur Model">Mirpur Model</option>
                  <option value="Mohammadpur">Mohammadpur</option>
                  <option value="Motijheel">Motijheel</option>
                  <option value="Mugda">Mugda</option>
                  <option value="New Market">New Market</option>
                  <option value="Pallabi">Pallabi</option>
                  <option value="Paltan Model">Paltan Model</option>
                  <option value="Ramna Model">Ramna Model</option>
                  <option value="Rampura">Rampura</option>
                  <option value="Rupnagar">Rupnagar</option>
                  <option value="Sabujbag">Sabujbag</option>
                  <option value="Shah Ali">Shah Ali</option>
                  <option value="Shahbag">Shahbag</option>
                  <option value="Shahjahanpur">Shahjahanpur</option>
                  <option value="Sher-e-Bangla Nagar">Sher-e-Bangla Nagar</option>
                  <option value="Shyampur">Shyampur</option>
                  <option value="Sutrapur">Sutrapur</option>
                  <option value="Tejgaon">Tejgaon</option>
                  <option value="Tejgaon Industrial Area">Tejgaon Industrial Area</option>
                  <option value="Turag">Turag</option>
                  <option value="Uttarkhan">Uttarkhan</option>
                  <option value="Uttara East">Uttara East</option>
                  <option value="Uttara West">Uttara West</option>
                  <option value="Vatara">Vatara</option>
                  <option value="Wari">Wari</option>
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
