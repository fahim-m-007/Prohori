import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Award,
  Calendar,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  CloudRain,
  Edit3,
  Eye,
  EyeOff,
  HeartHandshake,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Phone,
  Plus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  ThumbsUp,
} from "lucide-react";
import "./Profile.css";
import { useAuth } from "../context/AuthContext";
import { useReports } from "../context/ReportsContext";
import ReportDetailModal from "../components/ReportDetailModal";

const initialUser = {
  name: "Citizen Sentinel",
  email: "",
  phone: "",
  primaryThana: "Dhaka",
  joinedDate: "2026",
  role: "Verified Citizen Sentinel",
  reputationLevel: "Level 1 Sentinel",
  bio: "Committed to making Dhaka streets safer and well-monitored for everyone.",
};

function Profile() {
  const { user: authUser, updateProfile, changePassword } = useAuth();
  const { reports, isLoadingReports } = useReports();
  const [customProfile, setCustomProfile] = useState(null);

  const currentUserId = authUser?.id || authUser?._id;

  const myReports = useMemo(() => {
    if (!reports || !currentUserId) return [];
    return reports.filter((r) => {
      if (!r.reportedBy) return false;
      return (
        String(r.reportedBy) === String(currentUserId) ||
        (authUser?._id && String(r.reportedBy) === String(authUser._id))
      );
    });
  }, [reports, currentUserId, authUser]);

  const totalConfirmations = useMemo(() => {
    return myReports.reduce((sum, r) => sum + (Number(r.upvotes) || 0), 0);
  }, [myReports]);

  // Dynamic 5-Tier Sentinel Badges System
  const badges = useMemo(() => {
    const totalReports = myReports.length;
    const waterloggingReports = myReports.filter(
      (r) => r.category === "Waterlogging",
    );
    const roadHazardReports = myReports.filter((r) =>
      ["Road accident", "Traffic disruption", "Protest Blockade"].includes(
        r.category,
      ),
    );

    // Chronological order for milestone unlock dates
    const chronologicalReports = [...myReports].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeA - timeB;
    });

    const formatMilestoneDate = (dateVal) => {
      if (!dateVal) return null;
      return new Date(dateVal).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    };

    // 1. First Alert (1st report submitted)
    const isFirstAlertUnlocked = totalReports >= 1;
    const firstAlertEarnedDate = isFirstAlertUnlocked
      ? formatMilestoneDate(chronologicalReports[0]?.createdAt) || "Earned"
      : null;

    // 2. Monsoon Watcher (At least 1 waterlogging report)
    const isMonsoonUnlocked = waterloggingReports.length >= 1;
    const monsoonEarnedDate = isMonsoonUnlocked
      ? formatMilestoneDate(waterloggingReports[0]?.createdAt) || "Earned"
      : null;

    // 3. Road Sentinel (3 road/traffic hazard reports)
    const roadHazardCount = roadHazardReports.length;
    const isRoadSentinelUnlocked = roadHazardCount >= 3;
    const roadSentinelEarnedDate = isRoadSentinelUnlocked
      ? formatMilestoneDate(roadHazardReports[2]?.createdAt) || "Earned"
      : null;

    // 4. Community Confirmed (15 community confirmations received)
    const isCommunityConfirmedUnlocked = totalConfirmations >= 15;
    const communityEarnedDate = isCommunityConfirmedUnlocked ? "Earned" : null;

    // 5. City Watcher (5 incident reports total)
    const isCityWatcherUnlocked = totalReports >= 5;
    const cityWatcherEarnedDate = isCityWatcherUnlocked
      ? formatMilestoneDate(chronologicalReports[4]?.createdAt) || "Earned"
      : null;

    return [
      {
        id: "badge-frontline-scout",
        name: "Frontline Scout",
        icon: <ShieldCheck size={20} />,
        color: "#2563eb",
        bgColor: "#eff6ff",
        description:
          "Stepped onto the frontlines by logging your first community incident in Dhaka.",
        isUnlocked: isFirstAlertUnlocked,
        current: Math.min(totalReports, 1),
        target: 1,
        progressPercent: Math.min(100, Math.round((totalReports / 1) * 100)),
        progressLabel: isFirstAlertUnlocked
          ? "Completed"
          : `${totalReports} / 1 report logged`,
        earnedDate: firstAlertEarnedDate,
      },
      {
        id: "badge-monsoon-navigator",
        name: "Monsoon Navigator",
        icon: <CloudRain size={20} />,
        color: "#0284c7",
        bgColor: "#f0f9ff",
        description:
          "Mapped flooded streets or waterlogged choke points during Dhaka rains.",
        isUnlocked: isMonsoonUnlocked,
        current: Math.min(waterloggingReports.length, 1),
        target: 1,
        progressPercent: Math.min(
          100,
          Math.round((waterloggingReports.length / 1) * 100),
        ),
        progressLabel: isMonsoonUnlocked
          ? "Completed"
          : `${waterloggingReports.length} / 1 waterlog reported`,
        earnedDate: monsoonEarnedDate,
      },
      {
        id: "badge-gridlock-breaker",
        name: "Gridlock Breaker",
        icon: <AlertTriangle size={20} />,
        color: "#f59e0b",
        bgColor: "#fffbeb",
        description:
          "Helped commuters avoid severe traffic jams, accidents, and route blockades 3 times.",
        isUnlocked: isRoadSentinelUnlocked,
        current: Math.min(roadHazardCount, 3),
        target: 3,
        progressPercent: Math.min(
          100,
          Math.round((roadHazardCount / 3) * 100),
        ),
        progressLabel: isRoadSentinelUnlocked
          ? "Completed"
          : `${roadHazardCount} / 3 road reports`,
        earnedDate: roadSentinelEarnedDate,
      },
      {
        id: "badge-trusted-vanguard",
        name: "Trusted Vanguard",
        icon: <HeartHandshake size={20} />,
        color: "#6d4aff",
        bgColor: "#f5f3ff",
        description:
          "Earned 15 community endorsements on your alerts from fellow commuters.",
        isUnlocked: isCommunityConfirmedUnlocked,
        current: Math.min(totalConfirmations, 15),
        target: 15,
        progressPercent: Math.min(
          100,
          Math.round((totalConfirmations / 15) * 100),
        ),
        progressLabel: isCommunityConfirmedUnlocked
          ? "Completed"
          : `${totalConfirmations} / 15 confirmations`,
        earnedDate: communityEarnedDate,
      },
      {
        id: "badge-dhaka-guardian",
        name: "Dhaka Guardian",
        icon: <Award size={20} />,
        color: "#10b981",
        bgColor: "#ecfdf5",
        description:
          "Consistently safeguarded commuters by logging 5 incident reports across the city.",
        isUnlocked: isCityWatcherUnlocked,
        current: Math.min(totalReports, 5),
        target: 5,
        progressPercent: Math.min(
          100,
          Math.round((totalReports / 5) * 100),
        ),
        progressLabel: isCityWatcherUnlocked
          ? "Completed"
          : `${totalReports} / 5 reports logged`,
        earnedDate: cityWatcherEarnedDate,
      },
    ];
  }, [myReports, totalConfirmations]);

  const unlockedBadgesCount = useMemo(() => {
    return badges.filter((b) => b.isUnlocked).length;
  }, [badges]);

  const primaryThana =
    customProfile?.primaryThana ?? authUser?.thana ?? initialUser.primaryThana;
  const name = customProfile?.name ?? authUser?.name ?? initialUser.name;
  const email = customProfile?.email ?? authUser?.email ?? initialUser.email;
  const bio =
    customProfile?.bio ??
    authUser?.bio ??
    (primaryThana
      ? `Active commuter in ${primaryThana}. Committed to making Dhaka streets safer and well-monitored for everyone.`
      : initialUser.bio);
  const phone =
    customProfile?.phone !== undefined
      ? customProfile.phone
      : authUser?.phone || "";
  const joinedDate = authUser?.createdAt
    ? new Date(authUser.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : initialUser.joinedDate;
  const role =
    authUser?.role === "admin"
      ? "System Administrator"
      : initialUser.role;

  const user = {
    ...initialUser,
    name,
    email,
    primaryThana,
    bio,
    phone,
    joinedDate,
    role,
  };

  const [toastMessage, setToastMessage] = useState("");
  const [activeDetailReport, setActiveDetailReport] = useState(null);

  // Modal State (Profile + Security Tabs)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState("profile"); // "profile" | "security"

  // Edit Profile fields
  const [editName, setEditName] = useState(user.name);
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

    const hasChanges =
      editName.trim() !== (user.name || "").trim() ||
      editPhone.trim() !== (user.phone || "").trim() ||
      editBio.trim() !== (user.bio || "").trim() ||
      editThana !== (user.primaryThana || "");

    if (!hasChanges) {
      showToast("No changes were made.");
      setIsEditProfileOpen(false);
      return;
    }

    setIsSavingProfile(true);
    try {
      if (updateProfile) {
        await updateProfile({
          name: editName.trim(),
          phone: editPhone,
          thana: editThana,
          bio: editBio,
        });
      }
      setCustomProfile({
        name: editName.trim(),
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
      setPasswordError(
        err.response?.data?.message || "Failed to change password.",
      );
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
              <h1>{user.name}</h1>
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
                  <Phone size={13} />+ Add phone
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
            <strong className="stat-val">{myReports.length}</strong>
            <small>
              {myReports.length === 1
                ? "1 incident reported"
                : `${myReports.length} incidents reported`}
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap purple">
            <ThumbsUp size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Helpful Confirmations</span>
            <strong className="stat-val">{totalConfirmations}</strong>
            <small>
              {totalConfirmations === 1
                ? "1 citizen helped"
                : `${totalConfirmations} citizen confirmations`}
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap green">
            <Award size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Sentinel Badges</span>
            <strong className="stat-val">
              {unlockedBadgesCount} / {badges.length}
            </strong>
            <small>
              {unlockedBadgesCount === badges.length
                ? "All milestones unlocked!"
                : `${unlockedBadgesCount} unlocked · ${badges.length - unlockedBadgesCount} in progress`}
            </small>
          </div>
        </div>
      </div>

      {/* MY SUBMITTED REPORTS TIMELINE */}
      <section className="profile-section-card full-width">
        <div className="section-header">
          <div>
            <h2>My Incident Reporting History</h2>
            <p>
              Community safety reports you submitted across Dhaka city.
            </p>
          </div>
          <Link to="/report-incident" className="btn-new-report-link">
            <Plus size={14} />
            <span>Submit New Report</span>
          </Link>
        </div>

        {isLoadingReports ? (
          <div className="profile-reports-loading">
            <p>Loading your incident history...</p>
          </div>
        ) : myReports.length === 0 ? (
          <div className="profile-reports-empty">
            <div className="empty-icon-box">
              <ShieldAlert size={30} />
            </div>
            <h3>No Incident Reports Yet</h3>
            <p>
              You haven't submitted any road hazard or community safety alerts.
              When you report incidents in Dhaka, they will appear here with live
              verification updates.
            </p>
            <Link to="/report-incident" className="btn-empty-report">
              <Plus size={15} />
              <span>Report Your First Incident</span>
            </Link>
          </div>
        ) : (
          <div className="my-reports-list">
            {myReports.map((report) => {
              const reportId = report.id || report._id;
              const formattedLocation = report.location
                ? `${report.location}${report.thana ? `, ${report.thana}` : ""}`
                : report.thana || "Dhaka";
              const formattedDate =
                report.time ||
                (report.createdAt
                  ? new Date(report.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Recently");

              return (
                <div
                  className="my-report-row"
                  key={reportId}
                  onClick={() => setActiveDetailReport(report)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveDetailReport(report);
                    }
                  }}
                  title="Click to view full details, photos, and discussion"
                >
                  <div className="report-status-icon">
                    {report.status === "resolved" ? (
                      <CheckCircle size={20} className="status-resolved" />
                    ) : (
                      <ShieldAlert size={20} className="status-verified" />
                    )}
                  </div>

                  <div className="report-main-info">
                    <strong>{report.title || report.type}</strong>
                    <div className="report-location-date">
                      <span>
                        <MapPin size={12} /> {formattedLocation}
                      </span>
                      <span>·</span>
                      <span>
                        <Clock size={12} /> {formattedDate}
                      </span>
                    </div>
                  </div>

                  <div className="report-impact">
                    <span className="report-upvotes">
                      <ThumbsUp size={13} /> {report.upvotes || 0} Confirmations
                    </span>
                    <span className={`status-pill ${report.status || "verified"}`}>
                      {report.status === "resolved"
                        ? "Hazard Resolved"
                        : "Community Verified"}
                    </span>
                  </div>

                  <div className="report-row-arrow" aria-hidden="true">
                    <ChevronRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* BADGES SECTION */}
      <section className="profile-section-card full-width">
        <div className="section-header">
          <div>
            <h2>Prohori Sentinel Badges</h2>
            <p>
              Achievements earned by actively reporting road hazards and helping Dhaka commuters.
            </p>
          </div>
          <span className="badges-progress-counter">
            {unlockedBadgesCount} of {badges.length} Unlocked
          </span>
        </div>

        <div className="badges-grid">
          {badges.map((badge) => (
            <div
              className={`badge-item ${badge.isUnlocked ? "unlocked" : "locked"}`}
              key={badge.id}
            >
              <div
                className="badge-icon-box"
                style={{
                  background: badge.isUnlocked ? badge.bgColor : "#f1f5f9",
                  color: badge.isUnlocked ? badge.color : "#94a3b8",
                }}
              >
                {badge.isUnlocked ? badge.icon : <Lock size={18} />}
              </div>
              <div className="badge-details">
                <div className="badge-title-line">
                  <strong>{badge.name}</strong>
                  <span
                    className={`badge-status-pill ${badge.isUnlocked ? "status-unlocked" : "status-locked"}`}
                  >
                    {badge.isUnlocked ? "Unlocked" : "In Progress"}
                  </span>
                </div>
                <p>{badge.description}</p>

                {badge.isUnlocked ? (
                  <div className="badge-unlocked-meta">
                    <CheckCircle2 size={13} />
                    <span>
                      Unlocked {badge.earnedDate ? `· ${badge.earnedDate}` : ""}
                    </span>
                  </div>
                ) : (
                  <div className="badge-progress-wrap">
                    <div className="badge-progress-text">
                      <span>{badge.progressLabel}</span>
                      <span>{badge.progressPercent}%</span>
                    </div>
                    <div className="badge-progress-bar-bg">
                      <div
                        className="badge-progress-bar-fill"
                        style={{
                          width: `${badge.progressPercent}%`,
                          background: badge.color,
                        }}
                      />
                    </div>
                  </div>
                )}
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
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter your full name"
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
                    <option value="Airport / Bimanbandar">
                      Airport / Bimanbandar
                    </option>
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
                    <option value="Sher-e-Bangla Nagar">
                      Sher-e-Bangla Nagar
                    </option>
                    <option value="Shyampur">Shyampur</option>
                    <option value="Sutrapur">Sutrapur</option>
                    <option value="Tejgaon">Tejgaon</option>
                    <option value="Tejgaon Industrial Area">
                      Tejgaon Industrial Area
                    </option>
                    <option value="Turag">Turag</option>
                    <option value="Uttarkhan">Uttarkhan</option>
                    <option value="Uttara East">Uttara East</option>
                    <option value="Uttara West">Uttara West</option>
                    <option value="Vatara">Vatara</option>
                    <option value="Wari">Wari</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Short Bio (Optional)</label>
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
                      title={
                        showCurrentPassword ? "Hide password" : "Show password"
                      }
                      tabIndex="-1"
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
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
                      title={
                        showNewPassword ? "Hide password" : "Show password"
                      }
                      tabIndex="-1"
                    >
                      {showNewPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
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
                      title={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      tabIndex="-1"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
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

      {/* INCIDENT REPORT DETAIL MODAL */}
      {activeDetailReport && (
        <ReportDetailModal
          report={activeDetailReport}
          onClose={() => setActiveDetailReport(null)}
          onToast={showToast}
        />
      )}
    </div>
  );
}

export default Profile;
