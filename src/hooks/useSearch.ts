import { useState, useMemo, useCallback } from 'react';
import { useNoteStore } from '../store/useNoteStore';
import type { Note } from '../types/note';

export function useSearch() {
  const { notes } = useNoteStore();
  const [query, setQuery] = useState('');

  const results = useMemo<Note[]>(() => {
    if (!query.trim()) return notes.filter(n => !n.isArchived && !n.isTrash);
    const lower = query.toLowerCase();
    return notes.filter(
      note =>
        !note.isTrash &&
        (note.title.toLowerCase().includes(lower) ||
          note.content.toLowerCase().includes(lower) ||
          note.tags.some(tag => tag.toLowerCase().includes(lower)))
    );
  }, [query, notes]);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
  }, []);

  return { query, results, handleSearch, setQuery };
}
