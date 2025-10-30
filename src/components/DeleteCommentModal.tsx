/**
 * Delete comment confirmation modal
 * Modal for confirming comment deletion
 * 
 * @module DeleteCommentModal
 */

import React, { useEffect, useRef } from "react";

/**
 * Props for DeleteCommentModal component
 */
interface DeleteCommentModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback to close modal */
  onClose: () => void;
  /** Callback when deletion is confirmed */
  onConfirm: () => void;
  /** Whether the deletion is in progress */
  isDeleting?: boolean;
}

/**
 * DeleteCommentModal component
 * Confirmation dialog before deleting a comment
 * Shows warning message and confirm/cancel buttons
 * 
 * @component
 * @param {DeleteCommentModalProps} props - Component props
 * @returns {JSX.Element | null} Delete confirmation modal or null if closed
 * 
 * @example
 * ```tsx
 * <DeleteCommentModal
 *   isOpen={showDeleteModal}
 *   onClose={() => setShowDeleteModal(false)}
 *   onConfirm={() => handleDeleteComment(commentId)}
 *   isDeleting={isDeleting}
 * />
 * ```
 */
const DeleteCommentModal: React.FC<DeleteCommentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

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
   * Handles outside click to close modal
   * 
   * @param {React.MouseEvent} e - Click event
   */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isDeleting) {
      onClose();
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
      if (e.key === "Escape" && !isDeleting) {
        onClose();
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
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div ref={modalRef} className="bg-darkblue border border-white/20 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 id="delete-modal-title" className="text-xl font-semibold text-white">Eliminar comentario</h2>
          <button
            onClick={onClose}
            disabled={isDeleting}
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

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 9v4" />
                <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" />
                <path d="M12 16h.01" />
              </svg>
            </div>
            <div>
              <p className="text-white/90 mb-2">
                ¿Estás seguro de que deseas eliminar este comentario?
              </p>
              <p className="text-white/60 text-sm">
                Esta acción no se puede deshacer.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
              aria-label="Cancelar eliminación de comentario"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-6 py-2 bg-red-dark hover:bg-red-medium text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red cursor-pointer"
              aria-label="Confirmar eliminación de comentario"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCommentModal;
