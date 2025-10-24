import type { ReactNode } from "react";

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
 * - stopPropagation to prevent close on content click
 * - High z-index (2000) to be above other elements
 */
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[2000]"
      onClick={onClose}
    >
      <div
        className="flex flex-col justify-center items-center bg-darkblue border rounded-lg p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
