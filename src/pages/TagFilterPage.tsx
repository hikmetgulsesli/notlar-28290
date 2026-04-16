import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useNoteStore } from '../store/useNoteStore';
import { NoteCard } from '../components/NoteCard';
import { EmptyState } from '../components/EmptyState';

export function TagFilterPage() {
  const { tag } = useParams<{ tag: string }>();
  const { notes, toggleFavorite, moveToTrash } = useNoteStore();

  const decodedTag = tag ? decodeURIComponent(tag) : '';

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      if (note.isTrash || note.isArchived) return false;
      return note.tags.includes(decodedTag);
    });
  }, [notes, decodedTag]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tighter text-on-background mb-2">
          #{decodedTag}
        </h1>
        <p className="text-on-surface-variant text-sm">
          {filteredNotes.length} not bulundu
        </p>
      </div>

      {filteredNotes.length === 0 ? (
        <EmptyState type="tag" tag={decodedTag} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map(note => (
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