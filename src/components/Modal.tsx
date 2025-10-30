import { useEffect, useRef, type ReactNode } from "react";

/**
 * Props for the Modal component
 * @typedef {Object} ModalProps
 * @property {boolean} isOpen - Modal open state
 * @property {Function} onClose - Callback executed to close the modal
 * @property {ReactNode} children - Modal content
 */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Reusable generic modal component
 * Includes dark backdrop, screen centering, and close on outside click
 * Modal is not rendered if isOpen is false
 * 
 * @component
 * @param {ModalProps} props - Component props
 * @returns {JSX.Element | null} Rendered modal or null if closed
 * 
 * @example
 * ```tsx
 * <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
 *   <h2>Modal Title</h2>
 *   <p>Modal content here</p>
 *   <button onClick={() => setShowModal(false)}>Close</button>
 * </Modal>
 * ```
 * 
 * @description
 * Features:
 * - Dark backdrop (bg-black/80)
 * - Centered with flexbox
 * - Close on backdrop click
 * - Close on Escape key (keyboard accessibility)
 * - Focus trap: Tab only cycles through modal elements
 * - Auto-focus first element when modal opens
 * - Restore focus to trigger element when modal closes
 * - stopPropagation to prevent close on content click
 * - High z-index (2000) to be above other elements
 * - ARIA attributes for screen reader support
 */
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus trap and keyboard handling
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    // Save the element that had focus before modal opened
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Get all focuseable elements within the modal (excluding disabled buttons)
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
      if (e.key === "Escape") {
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[2000]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="flex flex-col justify-center items-center bg-darkblue border rounded-lg p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
