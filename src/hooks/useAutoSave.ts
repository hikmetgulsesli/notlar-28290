import { useState, useEffect, useCallback, useRef } from 'react';

export function useAutoSave<T>(
  data: T,
  key: string,
  delay: number = 1000
): { savedData: T | null; isSaving: boolean; lastSaved: Date | null } {
  const [savedData, setSavedData] = useState<T | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsSaving(true);

    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        setSavedData(data);
        setLastSaved(new Date());
        setIsSaving(false);
      } catch {
        setIsSaving(false);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, key, delay]);

  return { savedData, isSaving, lastSaved };
}

export function useDraft(draftKey: string) {
  const [title, setTitle] = useState(() => {
    try {
      const draft = localStorage.getItem(draftKey);
      return draft ? JSON.parse(draft).title || '' : '';
    } catch {
      return '';
    }
  });

  const [content, setContent] = useState(() => {
    try {
      const draft = localStorage.getItem(draftKey);
      return draft ? JSON.parse(draft).content || '' : '';
    } catch {
      return '';
    }
  });

  const [tags, setTags] = useState<string[]>(() => {
    try {
      const draft = localStorage.getItem(draftKey);
      return draft ? JSON.parse(draft).tags || [] : [];
    } catch {
      return [];
    }
  });

  const saveDraft = useCallback(() => {
    try {
      localStorage.setItem(draftKey, JSON.stringify({ title, content, tags }));
    } catch {
      // localStorage full or unavailable
    }
  }, [draftKey, title, content, tags]);

  useEffect(() => {
    const timeout = setTimeout(saveDraft, 500);
    return () => clearTimeout(timeout);
  }, [saveDraft]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(draftKey);
    setTitle('');
    setContent('');
    setTags([]);
  }, [draftKey]);

  return { title, setTitle, content, setContent, tags, setTags, saveDraft, clearDraft };
}
