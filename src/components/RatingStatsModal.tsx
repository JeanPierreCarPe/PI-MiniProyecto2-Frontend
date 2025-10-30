/**
 * Rating Statistics Modal Component
 * Displays rating statistics and all ratings with user's own rating highlighted
 * 
 * @module RatingStatsModal
 */

import { useEffect, useRef, useState } from "react";
import useUserStore from "../stores/useUserStore";

/**
 * Props for RatingStatsModal component
 */
interface RatingStatsModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback to close modal */
  onClose: () => void;
  /** Rating statistics from backend */
  stats: {
    averageRating: number;
    totalRatings: number;
    ratings: Array<{
      userId: string;
      rating: number;
      createdAt: string;
    }>;
  } | null;
  /** Callback when user wants to edit their rating */
  onEditRating: () => void;
  /** Callback when user wants to delete their rating */
  onDeleteRating: () => void;
  /** Whether deletion is in progress */
  isDeleting?: boolean;
}

/**
 * RatingStatsModal Component
 * Shows all ratings with user's rating highlighted at the top
 * Simple design with scroll for ratings list
 * 
 * @component
 * @param {RatingStatsModalProps} props - Component props
 * @returns {JSX.Element | null} Rating stats modal or null if closed
 */
const RatingStatsModal: React.FC<RatingStatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onEditRating,
  onDeleteRating,
  isDeleting = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { user } = useUserStore();

  // Focus trap and keyboard handling
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    previousActiveElement.current = document.activeElement as HTMLElement;

    const getAllElements = () => {
      if (!modalRef.current) return [];
      return Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([tabindex="-1"]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("disabled"));
    };

    const focusFirst = () => {
      const elements = getAllElements();
      if (elements.length > 0) {
        elements[0].focus();
      }
    };

    focusFirst();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const focusableElements = getAllElements();

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        if (focusableElements.length === 1) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, isDeleting, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !stats) return null;

  // Separate user's ratings from others
  const userRatings = user 
    ? stats.ratings.filter(r => r.userId === user.id)
    : [];
  const otherRatings = user
    ? stats.ratings.filter(r => r.userId !== user.id)
    : stats.ratings;

  // Sort other ratings by date (newest first)
  const sortedOtherRatings = [...otherRatings].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Combine: user's ratings first, then others
  const allRatings = [...userRatings, ...sortedOtherRatings];

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1100] p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rating-stats-title"
    >
      <div
        ref={modalRef}
        className="bg-darkblue border border-white/20 rounded-lg shadow-xl w-full max-w-md flex flex-col"
        style={{ maxHeight: '85vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
          <h2 id="rating-stats-title" className="text-xl font-semibold text-white">
            Calificaciones
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white rounded"
            aria-label="Cerrar modal"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M18 6l-12 12" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Average Rating */}
        <div className="p-6 border-b border-white/10 flex-shrink-0">
          <div className="text-center">
            <div className="text-5xl font-bold text-yellow mb-2">
              {stats.averageRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill={star <= Math.round(stats.averageRating) ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  className={star <= Math.round(stats.averageRating) ? "text-yellow" : "text-white/40"}
                  aria-hidden="true"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
                </svg>
              ))}
            </div>
            <div className="text-white/60 text-sm">
              Basado en {stats.totalRatings} {stats.totalRatings === 1 ? 'calificación' : 'calificaciones'}
            </div>
          </div>
        </div>

        {/* Ratings List with Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3" style={{ minHeight: '200px', maxHeight: 'calc(85vh - 280px)' }}>
          {allRatings.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <p>No hay calificaciones aún</p>
            </div>
          ) : (
            allRatings.map((rating, index) => {
              const isUserRating = user && rating.userId === user.id;
              
              return (
                <div
                  key={`${rating.userId}-${index}`}
                  className={`p-4 rounded-lg border ${
                    isUserRating
                      ? 'bg-green/10 border-green/30'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {isUserRating && (
                        <span className="text-green font-semibold text-sm">Tú</span>
                      )}
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill={star <= rating.rating ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                            className={star <= rating.rating ? "text-yellow" : "text-white/40"}
                            aria-hidden="true"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    {isUserRating && !showDeleteConfirm && (
                      <div className="flex gap-1">
                        <button
                          onClick={onEditRating}
                          className="p-1 text-green hover:text-green/80 transition focus:outline-none focus:ring-2 focus:ring-green rounded"
                          aria-label="Editar tu calificación"
                          title="Editar"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                            <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                            <path d="M16 5l3 3" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="p-1 text-red hover:text-red/80 transition focus:outline-none focus:ring-2 focus:ring-red rounded"
                          aria-label="Eliminar tu calificación"
                          title="Eliminar"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 7l16 0" />
                            <path d="M10 11l0 6" />
                            <path d="M14 11l0 6" />
                            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {isUserRating && showDeleteConfirm ? (
                    <div className="bg-red/20 border border-red/40 rounded p-3 mt-2">
                      <p className="text-white text-sm mb-2">¿Eliminar tu calificación?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={onDeleteRating}
                          disabled={isDeleting}
                          className="flex-1 px-3 py-1 bg-red hover:bg-red/80 text-white text-sm rounded transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red"
                        >
                          {isDeleting ? "Eliminando..." : "Sí"}
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={isDeleting}
                          className="flex-1 px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-white"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-white/40 text-xs mt-1">
                      {formatDate(rating.createdAt)}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-4 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Cerrar modal de calificaciones"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingStatsModal;
