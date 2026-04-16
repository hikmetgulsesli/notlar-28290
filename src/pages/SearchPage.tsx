import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNoteStore } from '../store/useNoteStore';
import { NoteCard } from '../components/NoteCard';
import { EmptyState } from '../components/EmptyState';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const { notes, toggleFavorite, moveToTrash, searchNotes } = useNoteStore();

  const results = useMemo(() => {
    if (!query.trim()) {
      return notes.filter(n => !n.isArchived && !n.isTrash);
    }
    return searchNotes(query);
  }, [query, notes, searchNotes]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tighter text-on-background mb-4">
          Arama
        </h1>
        <div className="relative max-w-xl">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Notlarda ara..."
            className="w-full bg-slate-900/50 border border-outline rounded-lg py-3 pl-12 pr-4 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 transition-all"
            aria-label="Arama"
          />
        </div>
      </div>

      <div className="mb-6">
        <span className="text-on-surface-variant text-sm">
          {results.length} sonuç bulundu
        </span>
      </div>

      {results.length === 0 ? (
        <EmptyState type="search" searchQuery={query} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onToggleFavorite={toggleFavorite}
              onDelete={moveToTrash}
            />
          ))}
        </div>
      )}
    </div>
  );
}
