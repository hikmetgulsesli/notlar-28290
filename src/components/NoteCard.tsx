import { useNavigate } from 'react-router-dom';
import type { Note } from '../types/note';

interface NoteCardProps {
  note: Note;
  onToggleFavorite?: (id: string) => void;
  onDelete?: (id: string) => void;
  featured?: boolean;
}

export function NoteCard({ note, onToggleFavorite, onDelete, featured = false }: NoteCardProps) {
  const navigate = useNavigate();

  const formatDate = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'Az önce';
    if (hours < 24) return `${hours} saat önce`;
    if (days < 7) return `${days} gün önce`;
    if (days < 30) return `${Math.floor(days / 7)} hafta önce`;
    return new Date(timestamp).toLocaleDateString('tr-TR');
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-surface-container-low p-6 flex flex-col justify-between transition-all hover:bg-surface-container hover:translate-y-[-4px] cursor-pointer ${
        featured ? 'lg:col-span-2 h-[400px] p-8' : 'h-auto'
      }`}
      onClick={() => navigate(`/note/${note.id}`)}
      role="article"
      aria-label={`${note.title} başlıklı not`}
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3
            className={`font-bold text-on-surface tracking-tight group-hover:text-primary transition-colors ${
              featured ? 'text-3xl' : 'text-xl'
            }`}
          >
            {note.title}
          </h3>
          {note.isFavorite && (
            <span className="material-symbols-outlined text-primary/40 group-hover:text-primary transition-colors">
              auto_awesome
            </span>
          )}
        </div>

        {note.tags.length > 0 && (
          <div className="flex gap-2 mb-4">
            {note.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-bold rounded-sm uppercase tracking-wider"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div
          className={`text-sm leading-relaxed text-on-surface-variant line-clamp-4 ${
            featured ? 'line-clamp-6 font-mono' : ''
          }`}
        >
          <p>{note.content}</p>
        </div>
      </div>

      <div
        className={`flex items-center justify-between border-t border-white/5 pt-4 ${
          featured ? 'mt-8' : 'mt-6'
        }`}
      >
        <span className="text-[10px] font-label text-slate-500 uppercase tracking-widest">
          Son düzenleme: {formatDate(note.updatedAt)}
        </span>
        <div className="flex items-center gap-2">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
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
          <span className="material-symbols-outlined text-slate-500 group-hover:translate-x-1 transition-transform text-sm">
            arrow_forward
          </span>
        </div>
      </div>
    </div>
  );
}
