import { useEffect, useState } from "react";
import { CheckCircle2, MapPin, ThumbsUp, Trash2, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useReports } from "../context/ReportsContext";
import "./ReportDetailModal.css";

export default function ReportDetailModal({
  report,
  onClose,
  onToast,
  onDeleteReport,
}) {
  const { user } = useAuth();
  const { voteReport, addCommentToReport, deleteReport } = useReports();
  const [currentReport, setCurrentReport] = useState(report);
  const [newCommentText, setNewCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (!currentReport) return null;

  const isOwner =
    user &&
    currentReport.reportedBy &&
    (String(user.id) === String(currentReport.reportedBy) ||
      String(user._id) === String(currentReport.reportedBy));
  const isAdmin = user?.role === "admin";
  const canDelete = isOwner || isAdmin;

  const handleVote = async () => {
    setIsVoting(true);
    try {
      const updated = await voteReport(currentReport.id || currentReport._id);
      if (updated) {
        setCurrentReport((prev) => ({
          ...prev,
          ...updated,
          upvotes: updated.upvotes,
          userVoted: updated.userVoted,
        }));
        if (onToast) {
          onToast(
            updated.userVoted === "up"
              ? "Confirmed incident! Thank you for verifying."
              : "Vote removed.",
          );
        }
      }
    } catch (err) {
      if (onToast)
        onToast(
          err.response?.data?.message || "Please log in to confirm incidents.",
        );
    } finally {
      setIsVoting(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const reportId = currentReport.id || currentReport._id;
    try {
      if (onDeleteReport) {
        await onDeleteReport(reportId);
      } else {
        await deleteReport(reportId);
        if (onToast) {
          onToast("Incident report permanently deleted from database.");
        }
        onClose();
      }
    } catch (err) {
      if (onToast) {
        onToast(
          err.response?.data?.message ||
            err.message ||
            "Failed to delete report.",
        );
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      const updated = await addCommentToReport(
        currentReport.id || currentReport._id,
        newCommentText.trim(),
      );
      if (updated) {
        setCurrentReport((prev) => ({
          ...prev,
          ...updated,
          comments: updated.comments || prev.comments,
        }));
      }
      setNewCommentText("");
      if (onToast) onToast("Your update was posted to the community feed!");
    } catch (err) {
      if (onToast)
        onToast(
          err.response?.data?.message || "Please log in to post updates.",
        );
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const comments = currentReport.comments || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog report-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span className="cat-tag">{currentReport.category}</span>
            <h3 className="modal-report-title">{currentReport.title}</h3>
            <div className="modal-author-strip">
              <span className="author-label">Reported by:</span>
              <strong className="author-name">
                {currentReport.reporterName || "Citizen Reporter"}
              </strong>
            </div>
          </div>
          <div className="modal-header-actions">
            {canDelete && (
              <button
                type="button"
                className="modal-delete-btn"
                onClick={() => setShowDeleteConfirm(true)}
                title="Delete your report"
                aria-label="Delete this report"
              >
                <Trash2 size={14} />
                <span>Delete Report</span>
              </button>
            )}
            <button
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="modal-location-strip">
          <MapPin size={14} />
          <strong>{currentReport.location}</strong>
          <span>({currentReport.thana} Thana)</span>
          <span className="modal-time">
            · Reported{" "}
            {currentReport.timeTag || currentReport.time || "recently"}
          </span>
        </div>

        <p
          className={`modal-full-desc ${!currentReport.description || !currentReport.description.trim() ? "no-desc" : ""}`}
        >
          {currentReport.description && currentReport.description.trim()
            ? currentReport.description
            : "No additional written details were provided for this report."}
        </p>

        {Array.isArray(currentReport.images) &&
          currentReport.images.length > 0 && (
            <div className="modal-images-gallery">
              <h4 className="modal-section-subtitle">
                Attached Photos ({currentReport.images.length})
              </h4>
              <div className="modal-images-grid">
                {currentReport.images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="modal-img-wrap"
                    onClick={() => setLightboxImage(imgUrl)}
                    title="Click to view full photo in broad view"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setLightboxImage(imgUrl);
                      }
                    }}
                  >
                    <img
                      src={imgUrl}
                      alt={`Incident proof ${idx + 1}`}
                      className="modal-gallery-img"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        <div className="modal-confirmations-strip">
          <div className="confirm-info-left">
            <CheckCircle2 size={16} />
            <span>
              <strong>{currentReport.upvotes || 0} citizens</strong> have
              confirmed this incident live on ground.
            </span>
          </div>
          <button
            type="button"
            className={`btn-modal-vote ${currentReport.userVoted === "up" ? "active" : ""}`}
            onClick={handleVote}
            disabled={isVoting}
          >
            <ThumbsUp size={13} />
            <span>
              {currentReport.userVoted === "up" ? "Confirmed" : "Confirm"}
            </span>
          </button>
        </div>

        {/* LIVE UPDATES / COMMENTS */}
        <div className="modal-comments-section">
          <h4>Community Updates & On-ground Notes ({comments.length})</h4>

          <div className="comments-feed-box">
            {comments.length === 0 ? (
              <p className="no-comments-msg">
                No live updates yet. Are you near this area? Post a situation
                update below.
              </p>
            ) : (
              comments.map((c, idx) => (
                <div className="single-comment-item" key={c.id || idx}>
                  <div className="comment-author-line">
                    <strong>{c.author || "Citizen"}</strong>
                    <small>{c.time || "Just now"}</small>
                  </div>
                  <p>{c.text}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleAddComment} className="comment-input-form">
            <input
              type="text"
              placeholder="Add a live update (e.g. 'Road cleared', 'Water receding')..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              disabled={isSubmittingComment}
              required
            />
            <button
              type="submit"
              className="btn-send-update"
              disabled={isSubmittingComment}
            >
              {isSubmittingComment ? "Posting..." : "Post Update"}
            </button>
          </form>
        </div>
      </div>

      {/* PHOTO BROAD VIEW / IN-APP LIGHTBOX */}
      {lightboxImage && (
        <div
          className="photo-lightbox-overlay"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="photo-lightbox-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="photo-lightbox-close-btn"
              onClick={() => setLightboxImage(null)}
              aria-label="Exit photo broad view"
              title="Close (Exit broad view)"
            >
              <X size={15} />
            </button>
            <img
              src={lightboxImage}
              alt="Incident proof broad view"
              className="photo-lightbox-img"
            />
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {showDeleteConfirm && (
        <div
          className="delete-modal-overlay"
          onClick={() => !isDeleting && setShowDeleteConfirm(false)}
        >
          <div
            className="delete-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-modal-icon">
              <Trash2 size={24} />
            </div>
            <h3>Delete Incident Report?</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>"{currentReport.title}"</strong>? This will permanently
              remove this report and any attached photos from MongoDB and the
              live safety feed.
            </p>
            <div className="delete-modal-actions">
              <button
                type="button"
                className="btn-cancel-delete"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-confirm-delete"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
