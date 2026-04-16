import { useState, useCallback, useEffect } from 'react';
import type { Note, NoteStore } from '../types/note';

const STORAGE_KEY = 'notlar-notes';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function loadFromStorage(): Note[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveToStorage(notes: Note[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function useNoteStore(): NoteStore {
  const [notes, setNotes] = useState<Note[]>(() => loadFromStorage());

  useEffect(() => {
    saveToStorage(notes);
  }, [notes]);

  const addNote = useCallback((note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now();
    const newNote: Note = {
      ...note,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setNotes(prev => [newNote, ...prev]);
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note
      )
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id ? { ...note, isFavorite: !note.isFavorite, updatedAt: Date.now() } : note
      )
    );
  }, []);

  const archiveNote = useCallback((id: string) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id ? { ...note, isArchived: true, isTrash: false, updatedAt: Date.now() } : note
      )
    );
  }, []);

  const moveToTrash = useCallback((id: string) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id ? { ...note, isTrash: true, isArchived: false, updatedAt: Date.now() } : note
      )
    );
  }, []);

  const restoreFromTrash = useCallback((id: string) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id ? { ...note, isTrash: false, updatedAt: Date.now() } : note
      )
    );
  }, []);

  const permanentlyDelete = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  }, []);

  const searchNotes = useCallback((query: string): Note[] => {
    if (!query.trim()) return notes;
    const lower = query.toLowerCase();
    return notes.filter(
      note =>
        note.title.toLowerCase().includes(lower) ||
        note.content.toLowerCase().includes(lower) ||
        note.tags.some(tag => tag.toLowerCase().includes(lower))
    );
  }, [notes]);

  const filterByTag = useCallback((tag: string): Note[] => {
    return notes.filter(note => note.tags.includes(tag));
  }, [notes]);

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    toggleFavorite,
    archiveNote,
    moveToTrash,
    restoreFromTrash,
    permanentlyDelete,
    searchNotes,
    filterByTag,
  };
}
