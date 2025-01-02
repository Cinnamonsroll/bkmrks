"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface ModalContextProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggle: () => void;
}

export const ModalContext = createContext<ModalContextProps | undefined>(
  undefined
);

const Modal: React.FC<{ children: React.ReactNode }> & {
  Trigger: React.FC<{ children: React.ReactNode }>;
  Content: React.FC<{ children: React.ReactNode; onClose: () => void }>;
  Header: React.FC<{ children: React.ReactNode }>;
  Footer: React.FC<{ children: React.ReactNode }>;
  CloseButton: React.FC<{ className?: string; children: React.ReactNode }>;
  Close: () => void;
} = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <ModalContext.Provider value={{ isOpen, setIsOpen, toggle }}>
      {children}
    </ModalContext.Provider>
  );
};

const Trigger: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("Modal.Trigger must be used within a Modal");
  }

  const { toggle } = context;

  return (
    <button onClick={toggle} className="cursor-pointer w-full">
      {children}
    </button>
  );
};

const CloseButton: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className = "", children }) => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("Modal.CloseButton must be used within a Modal");
  }

  const { setIsOpen } = context;

  return (
    <button
      onClick={() => setIsOpen(false)}
      className={className}
      aria-label="Close modal"
    >
      {children}
    </button>
  );
};

const Content: React.FC<{ children: React.ReactNode; onClose: () => void }> = ({
  children,
  onClose,
}) => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("Modal.Content must be used within a Modal");
  }

  const { isOpen, setIsOpen } = context;
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) onClose();
  }, [isOpen, onClose]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        event.target instanceof Element &&
        event.target.classList.contains("modal-backdrop")
      ) {
        handleClose();
      }
    },
    [handleClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 backdrop-blur-md w-full h-full modal-backdrop z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-[100]"
          >
            <div
              ref={modalRef}
              className="bg-woodsmoke-700 border border-woodsmoke-600 rounded-lg shadow-lg w-full max-w-sm p-4 relative md:block hidden"
            >
              {children}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 1, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 1, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 flex md:hidden z-[100]"
          >
            <div
              ref={modalRef}
              className="bg-woodsmoke-700 border border-woodsmoke-600 rounded-t-lg shadow-lg w-full p-4 relative"
              style={{ maxHeight: "90vh", overflowY: "auto" }}
            >
              <div className="w-12 h-1.5 bg-woodsmoke-500 rounded-full mx-auto mb-4" />
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Header: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="text-lg font-semibold flex justify-between items-center">
      <div>{children}</div>
    </div>
  );
};

const Footer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="pt-2">{children}</div>;
};

const Close = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("Modal.Close must be used within a Modal");
  }

  const { setIsOpen } = context;
  setIsOpen(false);
};

Modal.Trigger = Trigger;
Modal.Content = Content;
Modal.Header = Header;
Modal.Footer = Footer;
Modal.CloseButton = CloseButton;
Modal.Close = Close;

export default Modal;
