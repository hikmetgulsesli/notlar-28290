import { useMemo } from 'react';
import { useNoteStore } from '../store/useNoteStore';

export interface TagInfo {
  name: string;
  count: number;
}

export function useTags() {
  const { notes } = useNoteStore();

  const allTags = useMemo<TagInfo[]>(() => {
    const tagMap = new Map<string, number>();
    
    notes.forEach(note => {
      if (!note.isTrash && !note.isArchived) {
        note.tags.forEach(tag => {
          tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
        });
      }
    });

    return Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [notes]);

  const getTagCount = (tagName: string): number => {
    return allTags.find(t => t.name === tagName)?.count || 0;
  };

  return {
    tags: allTags,
    getTagCount,
  };
}
