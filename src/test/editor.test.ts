import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, renderHook, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { renderMarkdownToHTML } from '../utils/markdown';
import { useNoteStore } from '../store/useNoteStore';

// We need to test the markdown renderer and note CRUD
// EditorPage requires Router context so we test the pieces

describe('renderMarkdownToHTML', () => {
  it('renders headings correctly', () => {
    expect(renderMarkdownToHTML('# Heading 1')).toContain('<h1');
    expect(renderMarkdownToHTML('## Heading 2')).toContain('<h2');
    expect(renderMarkdownToHTML('### Heading 3')).toContain('<h3');
  });

  it('renders bold text', () => {
    const result = renderMarkdownToHTML('Bu bir **kalın** metin');
    expect(result).toContain('<strong');
    expect(result).toContain('kalın');
  });

  it('renders italic text', () => {
    const result = renderMarkdownToHTML('Bu bir *italik* metin');
    expect(result).toContain('<em');
    expect(result).toContain('italik');
  });

  it('renders inline code', () => {
    const result = renderMarkdownToHTML('Kullan `console.log()` komutu');
    expect(result).toContain('<code');
    expect(result).toContain('console.log()');
  });

  it('renders code blocks', () => {
    const result = renderMarkdownToHTML('```js\nconst x = 1;\n```');
    expect(result).toContain('<pre');
    expect(result).toContain('const x = 1;');
  });

  it('renders blockquotes', () => {
    const result = renderMarkdownToHTML('> Bu bir alıntıdır');
    expect(result).toContain('<blockquote');
    expect(result).toContain('Bu bir alıntıdır');
  });

  it('renders unordered lists', () => {
    const result = renderMarkdownToHTML('- Öğe 1\n- Öğe 2\n- Öğe 3');
    expect(result).toContain('<ul');
    expect(result).toContain('Öğe 1');
    expect(result).toContain('Öğe 2');
    expect(result).toContain('Öğe 3');
  });

  it('renders ordered lists', () => {
    const result = renderMarkdownToHTML('1. Adım 1\n2. Adım 2');
    expect(result).toContain('<ol');
    expect(result).toContain('Adım 1');
    expect(result).toContain('Adım 2');
  });

  it('renders horizontal rules', () => {
    expect(renderMarkdownToHTML('---')).toContain('<hr');
    expect(renderMarkdownToHTML('***')).toContain('<hr');
  });

  it('renders links', () => {
    const result = renderMarkdownToHTML('[Metin](https://ornek.com)');
    expect(result).toContain('<a href="https://ornek.com"');
    expect(result).toContain('Metin');
  });

  it('renders paragraphs', () => {
    const result = renderMarkdownToHTML('Bu bir paragraf.');
    expect(result).toContain('<p');
    expect(result).toContain('Bu bir paragraf.');
  });

  it('handles empty input', () => {
    expect(renderMarkdownToHTML('')).toBe('');
  });

  it('escapes HTML in content', () => {
    const result = renderMarkdownToHTML('<script>alert("xss")</script>');
    expect(result).not.toContain('<script>');
    expect(result).toContain('&lt;script&gt;');
  });

  it('handles complex markdown with multiple elements', () => {
    const md = `# Başlık

Bu bir **kalın** ve *italik* paragraf.

## Alt Başlık

- Liste öğesi 1
- Liste öğesi 2

> Alıntı

\`\`\`
Kod bloğu
\`\`\``;

    const result = renderMarkdownToHTML(md);
    expect(result).toContain('<h1');
    expect(result).toContain('<h2');
    expect(result).toContain('<strong');
    expect(result).toContain('<em');
    expect(result).toContain('<ul');
    expect(result).toContain('<blockquote');
    expect(result).toContain('<pre');
  });
});

describe('Note CRUD - Editor Operations', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('creates a new note with all fields', () => {
    const { result } = renderHook(() => useNoteStore());

    act(() => {
      result.current.addNote({
        title: 'Sürdürülebilir Tasarım',
        content: '# Modern Mimari\n\n**Kalın metin** ve *italik* açıklama',
        tags: ['mimari', 'sürdürülebilirlik', 'tasarım'],
        isFavorite: false,
        isArchived: false,
        isTrash: false,
      });
    });

    expect(result.current.notes).toHaveLength(1);
    const note = result.current.notes[0];
    expect(note.title).toBe('Sürdürülebilir Tasarım');
    expect(note.content).toContain('Modern Mimari');
    expect(note.tags).toEqual(['mimari', 'sürdürülebilirlik', 'tasarım']);
    expect(note.id).toBeTruthy();
    expect(note.createdAt).toBeGreaterThan(0);
    expect(note.updatedAt).toBeGreaterThan(0);
  });

  it('updates an existing note', () => {
    const { result } = renderHook(() => useNoteStore());

    act(() => {
      result.current.addNote({
        title: 'Orijinal Başlık',
        content: 'Orijinal içerik',
        tags: ['test'],
        isFavorite: false,
        isArchived: false,
        isTrash: false,
      });
    });

    const noteId = result.current.notes[0].id;

    act(() => {
      result.current.updateNote(noteId, {
        title: 'Güncellenmiş Başlık',
        content: 'Güncellenmiş içerik',
        tags: ['test', 'güncel'],
      });
    });

    expect(result.current.notes[0].title).toBe('Güncellenmiş Başlık');
    expect(result.current.notes[0].content).toBe('Güncellenmiş içerik');
    expect(result.current.notes[0].tags).toEqual(['test', 'güncel']);
  });

  it('preserves non-updated fields when updating', () => {
    const { result } = renderHook(() => useNoteStore());

    act(() => {
      result.current.addNote({
        title: 'Test Notu',
        content: 'İçerik',
        tags: ['etiket'],
        isFavorite: true,
        isArchived: false,
        isTrash: false,
      });
    });

    const noteId = result.current.notes[0].id;

    act(() => {
      result.current.updateNote(noteId, { title: 'Yeni Başlık' });
    });

    expect(result.current.notes[0].title).toBe('Yeni Başlık');
    expect(result.current.notes[0].content).toBe('İçerik');
    expect(result.current.notes[0].isFavorite).toBe(true);
    expect(result.current.notes[0].tags).toEqual(['etiket']);
  });

  it('moves note to trash', () => {
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
      result.current.moveToTrash(noteId);
    });

    expect(result.current.notes[0].isTrash).toBe(true);
    expect(result.current.notes[0].isArchived).toBe(false);
  });

  it('creates note with empty tags', () => {
    const { result } = renderHook(() => useNoteStore());

    act(() => {
      result.current.addNote({
        title: 'Etiketsiz Not',
        content: 'İçerik',
        tags: [],
        isFavorite: false,
        isArchived: false,
        isTrash: false,
      });
    });

    expect(result.current.notes[0].tags).toEqual([]);
  });

  it('creates note with long markdown content', () => {
    const { result } = renderHook(() => useNoteStore());

    const longContent = Array.from({ length: 50 }, (_, i) => 
      `## Bölüm ${i + 1}\n\nBu bölümün içeriği burada yer alıyor. **Kalın** metin ve *italik* açıklama mevcuttur.\n\n- Madde 1\n- Madde 2\n`
    ).join('\n');

    act(() => {
      result.current.addNote({
        title: 'Uzun İçerikli Not',
        content: longContent,
        tags: ['uzun', 'test'],
        isFavorite: false,
        isArchived: false,
        isTrash: false,
      });
    });

    expect(result.current.notes[0].content.length).toBeGreaterThan(1000);
  });
});
