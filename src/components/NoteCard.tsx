import { useNavigate } from 'react-router-dom';
import type { Note } from '../types/note';

interface NoteCardProps {
  note: Note;
  onToggleFavorite?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function NoteCard({ note, onToggleFavorite, onDelete }: NoteCardProps) {
  const navigate = useNavigate();

  const formatDate = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'Az önce';
    if (hours < 24) return `${hours} saat önce`;
    if (days < 7) return `${days} gün önce`;
    return new Date(timestamp).toLocaleDateString('tr-TR');
  };

  return (
    <div
      className="group relative overflow-hidden rounded-xl bg-surface-container-low p-8 flex flex-col justify-between h-[400px] transition-all hover:bg-surface-container cursor-pointer"
      onClick={() => navigate(`/note/${note.id}`)}
      role="article"
      aria-label={`${note.title} başlıklı not`}
    >
      <div>
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-3xl font-bold text-on-surface tracking-tight group-hover:text-primary transition-colors">
            {note.title}
          </h2>
          {note.isFavorite && (
            <span className="material-symbols-outlined text-primary/40 group-hover:text-primary transition-colors">
              auto_awesome
            </span>
          )}
        </div>

        {note.tags.length > 0 && (
          <div className="flex gap-2 mb-6">
            {note.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full tracking-wide"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="font-mono text-sm leading-relaxed text-on-surface-variant line-clamp-6">
          <p>{note.content}</p>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-4">
        <span className="text-xs font-label text-slate-500 uppercase tracking-widest">
          Son düzenleme: {formatDate(note.updatedAt)}
        </span>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={e => {
              e.stopPropagation();
              onToggleFavorite?.(note.id);
            }}
            className={`p-2 rounded-lg transition-colors ${
              note.isFavorite
                ? 'text-yellow-400 hover:bg-yellow-400/10'
                : 'text-slate-400 hover:bg-slate-800/50'
            }`}
            aria-label={note.isFavorite ? 'Favorilerden kaldır' : 'Favorilere ekle'}
          >
            <span className="material-symbols-outlined text-sm">
              {note.isFavorite ? 'star' : 'star_border'}
            </span>
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              onDelete?.(note.id);
            }}
            className="p-2 text-slate-400 hover:bg-slate-800/50 rounded-lg transition-colors"
            aria-label="Sil"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
