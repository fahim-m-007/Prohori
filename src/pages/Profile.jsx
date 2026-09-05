import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Edit3,
  Eye,
  EyeOff,
  HeartHandshake,
  KeyRound,
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
  name: "Citizen Sentinel",
  fullName: "Citizen Sentinel",
  email: "",
  phone: "",
  primaryThana: "Dhaka",
  joinedDate: "2026",
  role: "Verified Citizen Sentinel",
  reputationLevel: "Level 1 Sentinel",
  bio: "Committed to making Dhaka streets safer and well-monitored for everyone.",
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
  const { user: authUser, updateProfile, changePassword } = useAuth();
  const [customProfile, setCustomProfile] = useState(null);

  const primaryThana = customProfile?.primaryThana ?? authUser?.thana ?? initialUser.primaryThana;
  const name = customProfile?.name ?? authUser?.name ?? initialUser.name;
  const fullName = customProfile?.fullName ?? authUser?.name ?? name;
  const email = customProfile?.email ?? authUser?.email ?? initialUser.email;
  const bio = customProfile?.bio ?? authUser?.bio ?? (primaryThana
    ? `Active commuter in ${primaryThana}. Committed to making Dhaka streets safer and well-monitored for everyone.`
    : initialUser.bio);
  const phone = customProfile?.phone !== undefined ? customProfile.phone : (authUser?.phone || "");
  const joinedDate = authUser?.createdAt
    ? new Date(authUser.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : initialUser.joinedDate;

  const user = {
    ...initialUser,
    name,
    fullName,
    email,
    primaryThana,
    bio,
    phone,
    joinedDate,
  };

  const [myReports] = useState(initialMyReports);
  const [toastMessage, setToastMessage] = useState("");

  // Modal State (Profile + Security Tabs)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState("profile"); // "profile" | "security"

  // Edit Profile fields
  const [editName, setEditName] = useState(user.name);
  const [editFullName, setEditFullName] = useState(user.fullName);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editBio, setEditBio] = useState(user.bio);
  const [editThana, setEditThana] = useState(user.primaryThana);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Change Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleOpenEdit = (tab = "profile") => {
    setActiveModalTab(tab);
    setEditName(user.name);
    setEditFullName(user.fullName);
    setEditPhone(user.phone || "");
    setEditBio(user.bio || "");
    setEditThana(user.primaryThana || "");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      if (updateProfile) {
        await updateProfile({
          name: editFullName || editName,
          phone: editPhone,
          thana: editThana,
          bio: editBio,
        });
      }
      setCustomProfile({
        name: editName,
        fullName: editFullName,
        phone: editPhone,
        bio: editBio,
        primaryThana: editThana,
      });
      setIsEditProfileOpen(false);
      showToast("Profile details updated successfully!");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    setIsChangingPassword(true);
    setPasswordError("");
    try {
      if (changePassword) {
        await changePassword({ currentPassword, newPassword });
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsEditProfileOpen(false);
      showToast("Password changed successfully!");
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setIsChangingPassword(false);
    }
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
              {user.phone ? (
                <span className="meta-chip">
                  <Phone size={13} />
                  {user.phone}
                </span>
              ) : (
                <button
                  type="button"
                  className="meta-chip meta-chip-add"
                  onClick={() => handleOpenEdit("profile")}
                  style={{
                    background: "rgba(37, 99, 235, 0.08)",
                    border: "1px dashed var(--blue)",
                    color: "var(--blue)",
                    cursor: "pointer",
                  }}
                  title="Click to add phone number"
                >
                  <Phone size={13} />
                  + Add phone
                </button>
              )}
              <span className="meta-chip">
                <Calendar size={13} />
                Member since {user.joinedDate}
              </span>
            </div>
          </div>

          <button
            className="btn-edit-profile"
            onClick={() => handleOpenEdit("profile")}
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
              <div className="modal-tab-group">
                <button
                  type="button"
                  className={`modal-tab-btn ${activeModalTab === "profile" ? "active" : ""}`}
                  onClick={() => setActiveModalTab("profile")}
                >
                  <Edit3 size={14} />
                  <span>Profile Details</span>
                </button>
                <button
                  type="button"
                  className={`modal-tab-btn ${activeModalTab === "security" ? "active" : ""}`}
                  onClick={() => {
                    setActiveModalTab("security");
                    setPasswordError("");
                  }}
                >
                  <KeyRound size={14} />
                  <span>Security & Password</span>
                </button>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setIsEditProfileOpen(false)}
              >
                ✕
              </button>
            </div>

            {activeModalTab === "profile" ? (
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
                  <label>Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+880 1711-XXXXXX"
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
                  <button
                    type="submit"
                    className="btn-modal-submit"
                    disabled={isSavingProfile}
                  >
                    {isSavingProfile ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleChangePassword} className="modal-form">
                {passwordError && (
                  <div
                    style={{
                      color: "var(--danger)",
                      fontSize: "13px",
                      marginBottom: "6px",
                      background: "#fef2f2",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #fecaca",
                    }}
                  >
                    {passwordError}
                  </div>
                )}
                <div className="form-group">
                  <label>Current Password</label>
                  <div className="password-input-wrap">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      title={showCurrentPassword ? "Hide password" : "Show password"}
                      tabIndex="-1"
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>New Password (min 8 characters)</label>
                  <div className="password-input-wrap">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      title={showNewPassword ? "Hide password" : "Show password"}
                      tabIndex="-1"
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <div className="password-input-wrap">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      title={showConfirmPassword ? "Hide password" : "Show password"}
                      tabIndex="-1"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-modal-cancel"
                    onClick={() => setIsEditProfileOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-modal-submit"
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
