"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { slideIn } from "../utils/motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // When modal is open, prevent background scrolling
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      // Re-enable scrolling when component unmounts or modal closes
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Don't render anything on the server or when closed and not mounted
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={(e) => {
            // Close when clicking the backdrop (outside modal)
            if (e.target === e.currentTarget) onClose();
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="fixed inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden z-10"
            variants={slideIn("down", "spring", 0, 0.75)}
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            <div className="flex items-center justify-between p-4 border-b bg-gray-800 text-white">
              <motion.h2
                className="text-xl font-semibold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {title}
              </motion.h2>
              <motion.button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors text-xl font-bold h-8 w-8 flex items-center justify-center"
                aria-label="Close"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                &times;
              </motion.button>
            </div>

            <motion.div
              className="p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {children}
            </motion.div>

            <motion.div
              className="p-4 border-t flex justify-end"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                onClick={onClose}
                className="px-4 py-2 bg-gray-800 rounded-md text-white hover:bg-gray-600 transition-colors"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
