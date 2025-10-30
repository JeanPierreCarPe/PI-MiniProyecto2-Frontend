/**
 * Comment modal component
 * Modal for adding or editing video comments
 * 
 * @module CommentModal
 */

import React, { useState, useEffect, useRef } from "react";

/**
 * Props for CommentModal component
 */
interface CommentModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback to close modal */
  onClose: () => void;
  /** Callback when form is submitted with comment text */
  onSubmit: (text: string) => void;
  /** Whether the submission is in progress */
  isSubmitting?: boolean;
  /** Initial text for editing (optional) */
  initialText?: string;
  /** Modal title (default: "Escribe tu comentario") */
  title?: string;
}

/**
 * CommentModal component
 * Modal with textarea for comment input and submit/cancel buttons
 * Prevents body scroll when open, closes on outside click
 * 
 * @component
 * @param {CommentModalProps} props - Component props
 * @returns {JSX.Element | null} Comment modal or null if closed
 * 
 * @example
 * ```tsx
 * // Add new comment
 * <CommentModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   onSubmit={(text) => handleAddComment(text)}
 *   isSubmitting={isSubmitting}
 * />
 * 
 * // Edit existing comment
 * <CommentModal
 *   isOpen={showEditModal}
 *   onClose={() => setShowEditModal(false)}
 *   onSubmit={(text) => handleEditComment(text)}
 *   initialText={comment.text}
 *   title="Editar comentario"
 *   isSubmitting={isSubmitting}
 * />
 * ```
 */
const CommentModal: React.FC<CommentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  initialText = "",
  title = "Escribe tu comentario",
}) => {
  const [text, setText] = useState(initialText);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  /**
   * Effect: Updates text when initialText changes
   * Useful for edit mode
   */
  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  /**
   * Effect: Prevents body scroll when modal is open
   */
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

  /**
   * Handles form submission
   * Validates text is not empty and calls onSubmit callback
   * 
   * @param {React.FormEvent} e - Form event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (text.trim().length === 0) {
      alert("Por favor escribe un comentario");
      return;
    }

    onSubmit(text.trim());
  };

  /**
   * Handles modal close
   * Resets text to initial value
   */
  const handleClose = () => {
    setText(initialText);
    onClose();
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

    // Focus the first element (textarea)
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

  /**
   * Handles outside click to close modal
   * 
   * @param {React.MouseEvent} e - Click event
   */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="comment-modal-title"
    >
      <div ref={modalRef} className="bg-darkblue border border-white/20 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 id="comment-modal-title" className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-white/60 hover:text-white transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-white rounded"
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
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M18 6l-12 12" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="comment-text" className="block text-white/80 mb-2">
              Comentario
            </label>
            <textarea
              id="comment-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isSubmitting}
              placeholder="Escribe tu comentario aquí..."
              rows={6}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-green/50 focus:ring-1 focus:ring-green/50 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              maxLength={1000}
              autoFocus
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-white/40 text-sm">
                Máximo 1000 caracteres
              </p>
              <p className={`text-sm ${text.length > 900 ? 'text-red' : 'text-white/60'}`}>
                {text.length}/1000
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
              aria-label="Cancelar comentario"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || text.trim().length === 0}
              className="px-6 py-2 bg-blue hover:bg-blue-medium text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green cursor-pointer"
              aria-label="Enviar comentario"
            >
              {isSubmitting ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentModal;
