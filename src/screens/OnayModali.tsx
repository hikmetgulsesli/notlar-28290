import { useState } from 'react';

interface OnayModaliProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'default';
}

export function OnayModali({
  isOpen,
  title,
  message,
  confirmLabel = 'Onayla',
  cancelLabel = 'İptal',
  onConfirm,
  onCancel,
  variant = 'default',
}: OnayModaliProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="alertdialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-surface-container-high rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-xl font-bold text-on-surface mb-2">{title}</h2>
        <p className="text-sm text-on-surface-variant mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-surface-container text-on-surface rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              variant === 'danger'
                ? 'bg-error text-on-error hover:opacity-90'
                : 'primary-gradient text-on-primary hover:opacity-90'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
