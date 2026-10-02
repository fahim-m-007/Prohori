import { useEffect, useState } from "react";
import { CheckCircle2, MapPin, ThumbsUp, X } from "lucide-react";
import { useReports } from "../context/ReportsContext";
import "./ReportDetailModal.css";

export default function ReportDetailModal({ report, onClose, onToast }) {
  const { voteReport, addCommentToReport } = useReports();
  const [currentReport, setCurrentReport] = useState(report);
  const [newCommentText, setNewCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (!currentReport) return null;

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
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
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
    </div>
  );
}
