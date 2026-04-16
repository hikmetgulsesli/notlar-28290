import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNoteStore } from '../store/useNoteStore';

interface NoteDetailProps {
  noteId?: string;
}

export function NoteDetail({ noteId }: NoteDetailProps) {
  const { id: paramId } = useParams<{ id: string }>();
  const id = noteId || paramId;
  const navigate = useNavigate();
  const { notes, toggleFavorite } = useNoteStore();

  const note = notes.find(n => n.id === id);

  useEffect(() => {
    if (!note && id) {
      navigate('/');
    }
  }, [note, id, navigate]);

  if (!note) return null;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
        </div>
      </div>

      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {note.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="bg-surface-container-low rounded-xl p-8">
        <pre className="whitespace-pre-wrap font-mono text-on-surface leading-relaxed">
          {note.content}
        </pre>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-sm text-on-surface-variant">
        <span>Oluşturulma: {formatDate(note.createdAt)}</span>
        <span>Güncellenme: {formatDate(note.updatedAt)}</span>
      </div>
    </div>
  );
}
