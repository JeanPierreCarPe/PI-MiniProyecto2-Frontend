import { useState, useEffect, useRef } from "react";

/**
 * Props for the RatingModal component
 * @typedef {Object} RatingModalProps
 * @property {boolean} isOpen - Modal open state
 * @property {Function} onClose - Callback to close the modal
 * @property {Function} onSubmit - Callback to submit rating (receives rating value 1-5)
 * @property {boolean} isSubmitting - Indicates if rating is being submitted
 * @property {number} initialRating - Initial rating to pre-select (optional)
 */
interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number) => void;
  isSubmitting?: boolean;
  initialRating?: number;
}

/**
 * Rating modal component with 5-star system
 * Allows users to rate videos from 1 to 5 stars
 * 
 * @component
 * @param {RatingModalProps} props - Component props
 * @returns {JSX.Element | null} Rating modal or null if closed
 * 
 * @description
 * Features:
 * - Interactive 5-star rating system
 * - Hover effect to preview rating
 * - Click to select rating (1-5)
 * - Visual feedback with filled stars
 * - Submit and Cancel buttons
 * - Prevents closing while submitting
 * - Keyboard accessible with focus trap
 * - Auto-focus first element
 * - Escape key to close
 * 
 * @example
 * ```tsx
 * <RatingModal
 *   isOpen={showRatingModal}
 *   onClose={() => setShowRatingModal(false)}
 *   onSubmit={(rating) => handleRating(rating)}
 *   isSubmitting={isRating}
 * />
 * ```
 */
const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  initialRating = 0,
}) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Update rating when initialRating changes
  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  /**
   * Handles modal close
   * Resets rating state when closing
   */
  const handleClose = () => {
    if (!isSubmitting) {
      setRating(0);
      setHoverRating(0);
      onClose();
    }
  };

  /**
   * Handles rating submission
   * Validates that a rating is selected before submitting
   */
  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating);
    }
  };

  // Focus trap and keyboard handling
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    // Save the element that had focus before modal opened
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Get all focuseable elements within the modal (including disabled buttons for cycle detection)
    const getAllElements = () => {
      if (!modalRef.current) return [];
      return Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([tabindex="-1"]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => !el.hasAttribute('disabled'));
    };

    // Focus the first element
    const focusFirst = () => {
      const elements = getAllElements();
      if (elements.length > 0) {
        elements[0].focus();
      }
    };

    focusFirst();

    // Handle keyboard events (Tab and Escape)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key
      if (e.key === "Escape" && !isSubmitting) {
        handleClose();
        return;
      }

      // Handle Tab key to trap focus
      if (e.key === "Tab") {
        const focusableElements = getAllElements();
        
        // If no focuseable elements, prevent tabbing
        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        // If only one focuseable element, prevent tabbing
        if (focusableElements.length === 1) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Shift + Tab (going backwards)
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } 
        // Tab (going forwards)
        else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Cleanup: restore focus when modal closes
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isSubmitting]);

  if (!isOpen) return null;

  /**
   * Renders a single star
   * @param {number} index - Star index (1-5)
   */
  const renderStar = (index: number) => {
    const isActive = (hoverRating || rating) >= index;

    return (
      <button
        key={index}
        type="button"
        onClick={() => setRating(index)}
        onMouseEnter={() => setHoverRating(index)}
        onMouseLeave={() => setHoverRating(0)}
        disabled={isSubmitting}
        className="transition-transform hover:scale-110 disabled:cursor-not-allowed"
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill={isActive ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${
            isActive ? "text-yellow" : "text-white/40"
          } transition-colors`}
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
        </svg>
      </button>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[2000]"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rating-modal-title"
    >
      <div
        ref={modalRef}
        className="flex flex-col justify-center items-center bg-darkblue border border-white/20 rounded-lg p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 id="rating-modal-title" className="text-2xl font-bold text-white mb-4">
          ¿Cómo calificarías este video?
        </h2>

        {/* Previous rating reminder */}
        {initialRating > 0 && (
          <div className="bg-green/20 border border-green/40 rounded-lg px-4 py-2 mb-4 w-full">
            <p className="text-green text-sm text-center">
              Tu calificación actual: <span className="font-bold">{initialRating} estrella{initialRating > 1 ? 's' : ''}</span>
            </p>
          </div>
        )}

        {/* Stars */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((index) => renderStar(index))}
        </div>

        {/* Rating text */}
        {rating > 0 && (
          <p className="text-white/70 mb-6">
            {rating === 1 && "Muy malo"}
            {rating === 2 && "Malo"}
            {rating === 3 && "Regular"}
            {rating === 4 && "Bueno"}
            {rating === 5 && "Excelente"}
          </p>
        )}

        {/* Buttons */}
        <div className="flex gap-4 w-full">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Cancelar calificación"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="flex-1 px-6 py-3 bg-blue text-white rounded-lg hover:bg-lightblue transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-lightblue"
            aria-label={initialRating > 0 ? "Actualizar calificación del video" : "Enviar calificación del video"}
          >
            {isSubmitting 
              ? "Enviando..." 
              : initialRating > 0 
                ? "Actualizar Calificación" 
                : "Enviar Calificación"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
