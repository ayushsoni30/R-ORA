import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'max-w-md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
    >
      <div
        className="fixed inset-0 bg-charcoal/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative bg-white rounded-lg border border-warm-border shadow-elevated w-full ${maxWidth} z-10 overflow-hidden transform transition-all animate-scaleUp`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-warm-border bg-warm-bg/40">
          <h3 id="modal-title" className="text-base font-bold text-charcoal">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-charcoal-muted hover:text-charcoal rounded hover:bg-warm-hover transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-5 py-4 text-sm text-charcoal leading-relaxed">
          {children}
        </div>
        {actions && (
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 px-5 py-3.5 bg-warm-bg border-t border-warm-border">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
