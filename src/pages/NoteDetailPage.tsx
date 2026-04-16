import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNoteStore } from '../store/useNoteStore';

export function NoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notes, toggleFavorite, archiveNote, moveToTrash, restoreFromTrash, permanentlyDelete } = useNoteStore();

  const note = notes.find(n => n.id === id);

  useEffect(() => {
    if (!note && id) {
      navigate('/');
    }
  }, [note, id, navigate]);

  if (!note) {
    return null;
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRestore = () => {
    restoreFromTrash(note.id);
    navigate('/');
  };

  const handlePermanentDelete = () => {
    permanentlyDelete(note.id);
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold tracking-tighter text-on-background">
          {note.title}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/editor/${note.id}`)}
            className="p-3 bg-surface-container rounded-lg text-on-surface hover:bg-surface-container-high transition-colors"
            aria-label="Düzenle"
          >
            <span className="material-symbols-outlined">edit</span>
          </button>
          <button
            onClick={() => toggleFavorite(note.id)}
            className={`p-3 rounded-lg transition-colors ${
              note.isFavorite
                ? 'bg-yellow-400/10 text-yellow-400'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
            aria-label={note.isFavorite ? 'Favorilerden kaldır' : 'Favorilere ekle'}
          >
            <span className="material-symbols-outlined">
              {note.isFavorite ? 'star' : 'star_border'}
            </span>
          </button>
          {!note.isTrash && (
            <>
              <button
                onClick={() => archiveNote(note.id)}
                className="p-3 bg-surface-container text-on-surface rounded-lg hover:bg-surface-container-high transition-colors"
                aria-label="Arşivle"
              >
                <span className="material-symbols-outlined">archive</span>
              </button>
              <button
                onClick={() => moveToTrash(note.id)}
                className="p-3 bg-surface-container text-on-surface rounded-lg hover:bg-surface-container-high transition-colors"
                aria-label="Çöpe at"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant mb-8">
        <span>Oluşturulma: {formatDate(note.createdAt)}</span>
        <span>Güncellenme: {formatDate(note.updatedAt)}</span>
        {note.isFavorite && (
          <span className="text-yellow-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">star</span>
            Favori
          </span>
        )}
        {note.isArchived && (
          <span className="text-blue-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">archive</span>
            Arşivlenmiş
          </span>
        )}
        {note.isTrash && (
          <span className="text-error flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">delete</span>
            Çöp kutusunda
          </span>
        )}
      </div>

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {note.tags.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="bg-surface-container-low rounded-xl p-8">
        <pre className="whitespace-pre-wrap font-mono text-on-surface leading-relaxed">
          {note.content}
        </pre>
      </div>

      {/* Trash Actions */}
      {note.isTrash && (
        <div className="mt-8 flex gap-4 justify-end">
          <button
            onClick={handleRestore}
            className="px-6 py-3 bg-surface-container text-on-surface rounded-lg hover:bg-surface-container-high transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined">restore</span>
            <span>Geri yükle</span>
          </button>
          <button
            onClick={handlePermanentDelete}
            className="px-6 py-3 bg-error-container text-on-error-container rounded-lg hover:opacity-80 transition-opacity flex items-center gap-2"
          >
            <span className="material-symbols-outlined">delete_forever</span>
            <span>Kalıcı olarak sil</span>
          </button>
        </div>
      )}
    </div>
  );
}
