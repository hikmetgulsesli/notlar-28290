import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNoteStore } from '../store/useNoteStore';
import { OnayModali } from '../screens/OnayModali';

interface NoteDetailProps {
  noteId?: string;
}

export function NoteDetail({ noteId }: NoteDetailProps) {
  const { id: paramId } = useParams<{ id: string }>();
  const id = noteId || paramId;
  const navigate = useNavigate();
  const { notes, toggleFavorite, moveToTrash, permanentlyDelete, restoreFromTrash } = useNoteStore();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPermanentDeleteModal, setShowPermanentDeleteModal] = useState(false);

  const note = notes.find(n => n.id === id);

  useEffect(() => {
    if (!note && id) {
      navigate('/');
    }
  }, [note, id, navigate]);

  if (!note) return null;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Az önce';
    if (minutes < 60) return `${minutes} dakika önce`;
    if (hours < 24) return `${hours} saat önce`;
    if (days < 7) return `${days} gün önce`;
    if (days < 30) return `${Math.floor(days / 7)} hafta önce`;
    return formatDate(timestamp);
  };

  const estimateReadingTime = (text: string) => {
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} dakika okuma`;
  };

  const handleMoveToTrash = () => {
    moveToTrash(note.id);
    setShowDeleteModal(false);
    navigate('/');
  };

  const handlePermanentDelete = () => {
    permanentlyDelete(note.id);
    setShowPermanentDeleteModal(false);
    navigate('/');
  };

  const handleRestore = () => {
    restoreFromTrash(note.id);
    navigate('/');
  };

  const handleToggleFavorite = () => {
    toggleFavorite(note.id);
  };

  return (
    <div className="max-w-4xl mx-auto px-8 md:px-12 py-16">
      {/* Detail Header */}
      <header className="flex flex-col gap-6 mb-16">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            {/* Tags */}
            {note.tags.length > 0 && (
              <div className="flex gap-2">
                {note.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-surface-variant text-primary text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-sm uppercase"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-5xl font-extrabold tracking-tighter text-on-surface">
              {note.title}
            </h1>

            {/* Date & Reading Time */}
            <div className="flex items-center gap-3 text-on-surface-variant/60 text-sm">
              <span className="material-symbols-outlined text-base">calendar_today</span>
              <span className="font-label">{formatDate(note.createdAt)}</span>
              <span className="mx-1">•</span>
              <span className="font-label">{estimateReadingTime(note.content)}</span>
              {note.isFavorite && (
                <>
                  <span className="mx-1">•</span>
                  <span className="text-yellow-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    Favori
                  </span>
                </>
              )}
              {note.isArchived && !note.isTrash && (
                <>
                  <span className="mx-1">•</span>
                  <span className="text-blue-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">archive</span>
                    Arşivlenmiş
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/editor/${note.id}`)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-all text-sm font-medium border border-outline-variant/10 cursor-pointer"
              aria-label="Düzenle"
            >
              <span className="material-symbols-outlined text-lg">edit</span>
              Düzenle
            </button>
            {!note.isTrash ? (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-error-container/20 text-error hover:bg-error-container/40 transition-all text-sm font-medium cursor-pointer"
                aria-label="Sil"
              >
                <span className="material-symbols-outlined text-lg">delete</span>
                Sil
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleRestore}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-all text-sm font-medium border border-outline-variant/10 cursor-pointer"
                  aria-label="Geri yükle"
                >
                  <span className="material-symbols-outlined text-lg">restore</span>
                  Geri Yükle
                </button>
                <button
                  onClick={() => setShowPermanentDeleteModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-error-container/20 text-error hover:bg-error-container/40 transition-all text-sm font-medium cursor-pointer"
                  aria-label="Kalıcı olarak sil"
                >
                  <span className="material-symbols-outlined text-lg">delete_forever</span>
                  Kalıcı Sil
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Markdown Content Area */}
      <article className="markdown-content">
        {note.content.split('\n').map((paragraph, i) => {
          if (!paragraph.trim()) return null;
          // Simple markdown-like rendering
          if (paragraph.startsWith('## ')) {
            return <h2 key={i}>{paragraph.replace('## ', '')}</h2>;
          }
          if (paragraph.startsWith('# ')) {
            return <h1 key={i}>{paragraph.replace('# ', '')}</h1>;
          }
          if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
            return (
              <ul key={i}>
                <li>{paragraph.replace(/^[-*]\s/, '')}</li>
              </ul>
            );
          }
          if (paragraph.startsWith('```')) {
            return null;
          }
          return <p key={i}>{paragraph}</p>;
        })}
      </article>

      {/* Footer Metadata */}
      <footer className="mt-20 pt-8 border-t border-outline-variant/10 flex justify-between items-center text-on-surface-variant/40 text-xs tracking-wide">
        <div className="flex items-center gap-4">
          <span>Son düzenleme: {formatRelativeTime(note.updatedAt)}</span>
        </div>
        <div className="flex gap-6">
          <button
            onClick={handleToggleFavorite}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            {note.isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: note.title, text: note.content }).catch(() => {});
              }
            }}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Paylaş
          </button>
        </div>
      </footer>

      {/* Delete Confirmation Modal */}
      <OnayModali
        isOpen={showDeleteModal}
        title="Notu Sil"
        message={`"${note.title}" başlıklı not çöp kutusuna taşınacak. Geri yükleyebilirsiniz.`}
        confirmLabel="Çöpe Taşı"
        cancelLabel="İptal"
        onConfirm={handleMoveToTrash}
        onCancel={() => setShowDeleteModal(false)}
        variant="danger"
      />

      {/* Permanent Delete Confirmation Modal */}
      <OnayModali
        isOpen={showPermanentDeleteModal}
        title="Kalıcı Olarak Sil"
        message={`"${note.title}" başlıklı not kalıcı olarak silinecek. Bu işlem geri alınamaz.`}
        confirmLabel="Kalıcı Sil"
        cancelLabel="İptal"
        onConfirm={handlePermanentDelete}
        onCancel={() => setShowPermanentDeleteModal(false)}
        variant="danger"
      />
    </div>
  );
}
