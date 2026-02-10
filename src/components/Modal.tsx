"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setClosing(false);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      document.body.style.overflow = "";
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen && visible && !closing) {
      handleClose();
    }
  }, [isOpen, visible, closing, handleClose]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 sm:p-4 modal-mobile ${
        closing ? "animate-backdrop-out" : "animate-backdrop-in"
      }`}
      onClick={(e) => {
        if (e.target === overlayRef.current) handleClose();
      }}
    >
      <div
        className={`bg-white dark:bg-neutral-900 rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 w-full sm:max-w-md shadow-2xl max-h-[90vh] overflow-y-auto ${
          closing
            ? "hidden sm:block sm:animate-scale-out animate-slide-down-out"
            : "animate-slide-up sm:animate-scale-in"
        }`}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center mb-3">
          <div className="w-10 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
        </div>

        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold">{title}</h3>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors active:scale-95"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">{children}</div>

        {footer && <div className="mt-5 sm:mt-6 pb-safe">{footer}</div>}
      </div>
    </div>
  );
}
