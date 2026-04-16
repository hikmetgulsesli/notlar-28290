import { useEffect, useCallback } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-high rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl">
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-on-surface">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
              aria-label="Kapat"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
