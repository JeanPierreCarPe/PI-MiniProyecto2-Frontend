import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

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
        <h3 className="text-2xl text-white font-semibold text-center mb-4">
        </h3>
        {children}
      </div>
    </div>
  );
};

export default Modal;
