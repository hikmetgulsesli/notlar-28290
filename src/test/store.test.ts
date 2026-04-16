import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNoteStore } from '../store/useNoteStore';
import type { Note } from '../types/note';

describe('useNoteStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('addNote', () => {
    it('should add a new note with generated id and timestamps', () => {
      const { result } = renderHook(() => useNoteStore());

      act(() => {
        result.current.addNote({
          title: 'Test Notu',
          content: 'Bu bir test içeriğidir',
          tags: ['test', 'örnek'],
          isFavorite: false,
          isArchived: false,
          isTrash: false,
        });
      });

      expect(result.current.notes).toHaveLength(1);
      expect(result.current.notes[0].title).toBe('Test Notu');
      expect(result.current.notes[0].content).toBe('Bu bir test içeriğidir');
      expect(result.current.notes[0].tags).toEqual(['test', 'örnek']);
      expect(result.current.notes[0].id).toBeDefined();
      expect(result.current.notes[0].createdAt).toBeDefined();
      expect(result.current.notes[0].updatedAt).toBeDefined();
    });

    it('should add multiple notes with unique ids', () => {
      const { result } = renderHook(() => useNoteStore());

      act(() => {
        result.current.addNote({
          title: 'Not 1',
          content: 'İçerik 1',
          tags: [],
          isFavorite: false,
          isArchived: false,
          isTrash: false,
        });
      });

      act(() => {
        result.current.addNote({
          title: 'Not 2',
          content: 'İçerik 2',
          tags: [],
          isFavorite: false,
          isArchived: false,
          isTrash: false,
        });
      });

      expect(result.current.notes).toHaveLength(2);
      expect(result.current.notes[0].id).not.toBe(result.current.notes[1].id);
    });
  });

  describe('updateNote', () => {
    it('should update note title and content', () => {
      const { result } = renderHook(() => useNoteStore());

      act(() => {
        result.current.addNote({
          title: 'Orijinal Başlık',
          content: 'Orijinal İçerik',
          tags: [],
          isFavorite: false,
          isArchived: false,
          isTrash: false,
        });
      });

      const noteId = result.current.notes[0].id;
      const originalUpdatedAt = result.current.notes[0].updatedAt;

      act(() => {
        result.current.updateNote(noteId, {
          title: 'Güncellenmiş Başlık',
          content: 'Güncellenmiş İçerik',
        });
      });

      expect(result.current.notes[0].title).toBe('Güncellenmiş Başlık');
      expect(result.current.notes[0].content).toBe('Güncellenmiş İçerik');
      expect(result.current.notes[0].updatedAt).toBeGreaterThanOrEqual(originalUpdatedAt);
    });
  });

  describe('deleteNote', () => {
    it('should remove note from store', () => {
      const { result } = renderHook(() => useNoteStore());

      act(() => {
        result.current.addNote({
          title: 'Silinecek Not',
          content: 'İçerik',
          tags: [],
          isFavorite: false,
          isArchived: false,
          isTrash: false,
        });
      });

      const noteId = result.current.notes[0].id;

      act(() => {
        result.current.deleteNote(noteId);
      });

      expect(result.current.notes).toHaveLength(0);
    });
  });

  describe('toggleFavorite', () => {
    it('should toggle note favorite status', () => {
      const { result } = renderHook(() => useNoteStore());

      act(() => {
        result.current.addNote({
          title: 'Favori Not',
          content: 'İçerik',
          tags: [],
          isFavorite: false,
          isArchived: false,
          isTrash: false,
        });
      });

      const noteId = result.current.notes[0].id;
      expect(result.current.notes[0].isFavorite).toBe(false);

      act(() => {
        result.current.toggleFavorite(noteId);
      });

      expect(result.current.notes[0].isFavorite).toBe(true);

      act(() => {
        result.current.toggleFavorite(noteId);
      });

      expect(result.current.notes[0].isFavorite).toBe(false);
    });
  });

  describe('archiveNote', () => {
    it('should set isArchived to true', () => {
      const { result } = renderHook(() => useNoteStore());

      act(() => {
        result.current.addNote({
          title: 'Arşivlenecek Not',
          content: 'İçerik',
          tags: [],
          isFavorite: false,
          isArchived: false,
          isTrash: false,
        });
      });

      const noteId = result.current.notes[0].id;

      act(() => {
        result.current.archiveNote(noteId);
      });

      expect(result.current.notes[0].isArchived).toBe(true);
      expect(result.current.notes[0].isTrash).toBe(false);
    });
  });

  describe('moveToTrash', () => {
    it('should set isTrash to true and clear archive', () => {
      const { result } = renderHook(() => useNoteStore());

      act(() => {
        result.current.addNote({
          title: 'Silinecek Not',
          content: 'İçerik',
          tags: [],
          isFavorite: false,
          isArchived: true,
          isTrash: false,
        });
      });

      const noteId = result.current.notes[0].id;

      act(() => {
        result.current.moveToTrash(noteId);
      });

      expect(result.current.notes[0].isTrash).toBe(true);
      expect(result.current.notes[0].isArchived).toBe(false);
    });
  });

  describe('restoreFromTrash', () => {
    it('should set isTrash to false', () => {
      const { result } = renderHook(() => useNoteStore());

      act(() => {
        result.current.addNote({
          title: 'Geri Yüklenecek Not',
          content: 'İçerik',
          tags: [],
          isFavorite: false,
          isArchived: false,
          isTrash: true,
        });
      });

      const noteId = result.current.notes[0].id;

      act(() => {
        result.current.restoreFromTrash(noteId);
      });

      expect(result.current.notes[0].isTrash).toBe(false);
    });
  });

  describe('permanentlyDelete', () => {
    it('should remove note from store permanently', () => {
      const { result } = renderHook(() => useNoteStore());

      act(() => {
        result.current.addNote({
          title: 'Kalıcı Silinecek Not',
          content: 'İçerik',
          tags: [],
          isFavorite: false,
          isArchived: false,
          isTrash: true,
        });
      });

      const noteId = result.current.notes[0].id;

      act(() => {
        result.current.permanentlyDelete(noteId);
      });

      expect(result.current.notes).toHaveLength(0);
    });
  });

  describe('searchNotes', () => {
    it('should find notes by title', () => {
      const { result } = renderHook(() => useNoteStore());

      act(() => {
        result.current.addNote({
          title: 'React Hooks Kılavuzu',
          content: 'useEffect hakkında',
          tags: ['react'],
          isFavorite: false,
          isArchived: false,
          isTrash: false,
        });
      });

      act(() => {
        result.current.addNote({
          title: 'TypeScript İpuçları',
          content: 'TypeScript type sistemi',
          tags: ['typescript'],
          isFavorite: false,
          isArchived: false,
          isTrash: false,
        });
      });

      const searchResults = result.current.searchNotes('React');
      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].title).toBe('React Hooks Kılavuzu');
    });

    it('should find notes by content', () => {
      const { result } = renderHook(() => useNoteStore());

      act(() => {
        result.current.addNote({
          title: 'Not Başlığı',
          content: 'Özel markdown syntax kullanımı',
          tags: [],
          isFavorite: false,
          isArchived: false,
          isTrash: false,
        });
      });

      const searchResults = result.current.searchNotes('markdown');
      expect(searchResults).toHaveLength(1);
    });

    it('should return all notes when query is empty', () => {
      const { result } = renderHook(() => useNoteStore());

      act(() => {
        result.current.addNote({
          title: 'Not 1',
          content: 'İçerik 1',
          tags: [],
          isFavorite: false,
          isArchived: false,
          isTrash: false,
        });
      });

      act(() => {
        result.current.addNote({
          title: 'Not 2',
          content: 'İçerik 2',
          tags: [],
          isFavorite: false,
          isArchived: false,
          isTrash: false,
        });
      });

      const searchResults = result.current.searchNotes('');
      expect(searchResults).toHaveLength(2);
    });
  });

  describe('filterByTag', () => {
    it('should filter notes by tag', () => {
      const { result } = renderHook(() => useNoteStore());

      act(() => {
        result.current.addNote({
          title: 'React Notu',
          content: 'İçerik',
          tags: ['react', 'frontend'],
          isFavorite: false,
          isArchived: false,
          isTrash: false,
        });
      });

      act(() => {
        result.current.addNote({
          title: 'Backend Notu',
          content: 'İçerik',
          tags: ['backend', 'nodejs'],
          isFavorite: false,
          isArchived: false,
          isTrash: false,
        });
      });

      const filtered = result.current.filterByTag('react');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('React Notu');
    });
  });

  describe('localStorage persistence', () => {
    it('should persist notes to localStorage', () => {
      const { result } = renderHook(() => useNoteStore());

      act(() => {
        result.current.addNote({
          title: 'Kaydedilecek Not',
          content: 'İçerik',
          tags: [],
          isFavorite: false,
          isArchived: false,
          isTrash: false,
        });
      });

      const stored = localStorage.getItem('notlar-notes');
      expect(stored).toBeTruthy();

      const parsedNotes: Note[] = JSON.parse(stored!);
      expect(parsedNotes).toHaveLength(1);
      expect(parsedNotes[0].title).toBe('Kaydedilecek Not');
    });
  });
});
