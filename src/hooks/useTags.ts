import { useMemo, useCallback } from 'react';
import { useNoteStore } from '../store/useNoteStore';

export interface TagInfo {
  name: string;
  count: number;
}

export function useTags() {
  const { notes, filterByTag } = useNoteStore();

  /** All unique tags across all non-trashed notes, sorted by frequency */
  const allTags = useMemo<TagInfo[]>(() => {
    const tagMap = new Map<string, number>();
    notes
      .filter(n => !n.isTrash)
      .forEach(note => {
        note.tags.forEach(tag => {
          tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
        });
      });
    return Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [notes]);

  /** Get notes filtered by a specific tag */
  const getNotesByTag = useCallback((tag: string): typeof notes => {
    return filterByTag(tag).filter(n => !n.isTrash);
  }, [filterByTag]);

  /** Total number of unique tags */
  const tagCount = allTags.length;

  /** Check if a tag exists */
  const tagExists = useCallback((tag: string): boolean => {
    return allTags.some(t => t.name === tag);
  }, [allTags]);

  return {
    allTags,
    getNotesByTag,
    tagCount,
    tagExists,
  };
}
