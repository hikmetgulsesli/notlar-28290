import { useEffect, useCallback } from 'react';

interface OnayModaliProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function OnayModali({
  isOpen,
  onClose,
  onConfirm,
  title = 'Emin misiniz?',
  message = 'Bu işlem geri alınamaz.',
  confirmLabel = 'Onayla',
  cancelLabel = 'İptal',
  variant = 'danger',
}: OnayModaliProps) {
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

  const iconColorClass = variant === 'danger' ? 'text-error' : variant === 'warning' ? 'text-tertiary' : 'text-primary';
  const iconBgClass = variant === 'danger' ? 'bg-error-container/30' : variant === 'warning' ? 'bg-tertiary-fixed-dim/30' : 'bg-primary-container/30';
  const accentLineClass = variant === 'danger' ? 'bg-error/20' : variant === 'warning' ? 'bg-tertiary/20' : 'bg-primary/20';
  const confirmBtnClass = variant === 'danger'
    ? 'bg-gradient-to-br from-red-500 to-error-container text-on-primary-container shadow-lg shadow-red-900/20'
    : variant === 'warning'
    ? 'bg-gradient-to-br from-tertiary-fixed to-tertiary-container text-on-tertiary shadow-lg shadow-tertiary/20'
    : 'bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-lg shadow-primary/20';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Dialog Box */}
      <div className="w-full max-w-md bg-surface-container-highest/80 backdrop-blur-xl rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden border border-outline-variant/10">
        <div className="p-8">
          {/* Icon Header */}
          <div className={`w-12 h-12 rounded-full ${iconBgClass} flex items-center justify-center mb-6`}>
            <span
              className={`material-symbols-outlined ${iconColorClass}`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {variant === 'danger' ? 'warning' : variant === 'warning' ? 'error' : 'info'}
            </span>
          </div>

          {/* Text Content */}
          <div className="space-y-2 mb-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">{title}</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed">{message}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row-reverse gap-3">
            <button
              onClick={onConfirm}
              className={`flex-1 ${confirmBtnClass} px-6 py-3 rounded-lg font-bold text-sm transition-all active:scale-95 duration-100`}
            >
              {confirmLabel}
            </button>
            <button
              onClick={onClose}
              className="flex-1 text-on-surface-variant hover:bg-surface-bright px-6 py-3 rounded-lg font-semibold text-sm transition-all active:scale-95 duration-100"
            >
              {cancelLabel}
            </button>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className={`h-1 w-full ${accentLineClass}`} />
      </div>
    </div>
  );
}