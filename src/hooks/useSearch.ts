import { useState, useMemo, useCallback } from 'react';
import { useNoteStore } from '../store/useNoteStore';
import type { Note } from '../types/note';

export type SearchFilter = 'all' | 'title' | 'content' | 'tags';

export interface UseSearchOptions {
  /** Include archived notes in search results */
  includeArchived?: boolean;
  /** Include trashed notes in search results */
  includeTrashed?: boolean;
  /** Restrict search to specific fields */
  filterBy?: SearchFilter;
}

export function useSearch(options: UseSearchOptions = {}) {
  const { includeArchived = false, includeTrashed = false, filterBy = 'all' } = options;
  const { notes } = useNoteStore();
  const [query, setQuery] = useState('');

  const results = useMemo<Note[]>(() => {
    let filtered = notes;

    if (!includeTrashed) {
      filtered = filtered.filter(n => !n.isTrash);
    }
    if (!includeArchived) {
      filtered = filtered.filter(n => !n.isArchived);
    }

    if (!query.trim()) return filtered;

    const lower = query.toLowerCase();
    const terms = lower.split(/\s+/).filter(Boolean);

    return filtered.filter(note => {
      return terms.every(term => {
        const matchTitle = note.title.toLowerCase().includes(term);
        const matchContent = note.content.toLowerCase().includes(term);
        const matchTags = note.tags.some(tag => tag.toLowerCase().includes(term));

        switch (filterBy) {
          case 'title': return matchTitle;
          case 'content': return matchContent;
          case 'tags': return matchTags;
          default: return matchTitle || matchContent || matchTags;
        }
      });
    });
  }, [query, notes, includeArchived, includeTrashed, filterBy]);

  /** Search with a specific query string (imperative) */
  const search = useCallback((value: string) => {
    setQuery(value);
  }, []);

  /** Clear the search query */
  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  /** Check if a tag exists in the results */
  const hasTag = useCallback((tag: string) => {
    const lower = tag.toLowerCase();
    return results.some(note =>
      note.tags.some(t => t.toLowerCase() === lower)
    );
  }, [results]);

  /** Get all unique tags from search results */
  const resultTags = useMemo(() => {
    const tagSet = new Set<string>();
    results.forEach(note => note.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [results]);

  /** Count of results */
  const resultCount = results.length;

  /** Whether search is active (has a query) */
  const isSearching = query.trim().length > 0;

  return {
    query,
    results,
    resultCount,
    resultTags,
    isSearching,
    search,
    setQuery,
    clearSearch,
    hasTag,
  };
}
