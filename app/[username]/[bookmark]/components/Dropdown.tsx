"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

interface DropdownContextProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggle: () => void;
}

const DropdownContext = createContext<DropdownContextProps | undefined>(
  undefined
);

const Dropdown: React.FC<{ children: React.ReactNode }> & {
  Trigger: React.FC<{ children: React.ReactNode }>;
  Content: React.FC<{ children: React.ReactNode; align?: "left" | "right" }>;
  Item: React.FC<{
    children: React.ReactNode;
    onSelect?: () => void;
    selected?: boolean;
    selectedClassName?: string;
    className?: string;
style?: object
  }>;
  Separator: React.FC;
} = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggle = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen, toggle }}>
      <div ref={dropdownRef} className="relative">
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

const Trigger: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error("Dropdown.Trigger must be used within a Dropdown");
  }

  const { toggle } = context;

  return (
    <button onClick={toggle} className="cursor-pointer">
      {children}
    </button>
  );
};

const Content: React.FC<{
  children: React.ReactNode;
  align?: "left" | "right";
}> = ({ children, align = "right" }) => {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error("Dropdown.Content must be used within a Dropdown");
  }

  const { isOpen } = context;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`absolute  top-full mt-2 p-1 rounded-lg w-40 bg-woodsmoke-700 border border-woodsmoke-600 shadow-md ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Item: React.FC<{
  children: React.ReactNode;
  onSelect?: () => void;
  selected?: boolean;
  selectedClassName?: string;
  className?: string;
  style?: object
}> = ({ children, onSelect, selected, className, selectedClassName, style }) => {
  return (
    <div
      onClick={onSelect}
      style={style}
      className={`mt-1 text-sm overflow-hidden hover:bg-woodsmoke-400 transition-all text-woodsmoke-50 flex items-center h-8 gap-2 p-2 rounded-md cursor-pointer ${
        selected ? selectedClassName : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};

const Separator: React.FC = () => {
  return <div className="my-1 h-px bg-woodsmoke-500"></div>;
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Item = Item;
Dropdown.Separator = Separator;

export default Dropdown;
