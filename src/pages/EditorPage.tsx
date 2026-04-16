import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNoteStore } from '../store/useNoteStore';
import { renderMarkdownToHTML } from '../utils/markdown';

export function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notes, addNote, updateNote, moveToTrash } = useNoteStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const isEditing = Boolean(id);

  // Load existing note data
  useEffect(() => {
    if (id) {
      const note = notes.find(n => n.id === id);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setTags(note.tags);
      } else {
        navigate('/');
      }
    }
  }, [id, notes, navigate]);

  // Draft auto-save
  useEffect(() => {
    if (isEditing) return;
    const timeout = setTimeout(() => {
      localStorage.setItem('notlar-draft', JSON.stringify({ title, content, tags }));
    }, 500);
    return () => clearTimeout(timeout);
  }, [title, content, tags, isEditing]);

  // Load draft for new notes
  useEffect(() => {
    if (isEditing) return;
    try {
      const draft = localStorage.getItem('notlar-draft');
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.content) setContent(parsed.content);
        if (parsed.tags) setTags(parsed.tags);
      }
    } catch {
      // Ignore corrupt draft
    }
  }, [isEditing]);

  const handleTagKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = tagInput.trim().toLowerCase().replace(/,$/, '');
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
      }
      setTagInput('');
    }
    if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  }, [tagInput, tags]);

  const handleRemoveTag = useCallback((tag: string) => {
    setTags(tags.filter(t => t !== tag));
  }, [tags]);

  const handleSave = useCallback(() => {
    if (!title.trim()) return;

    setIsSaving(true);

    try {
      if (isEditing && id) {
        updateNote(id, { title, content, tags });
      } else {
        addNote({
          title,
          content,
          tags,
          isFavorite: false,
          isArchived: false,
          isTrash: false,
        });
        localStorage.removeItem('notlar-draft');
      }

      setLastSaved(new Date());
      navigate('/');
    } finally {
      setIsSaving(false);
    }
  }, [title, content, tags, isEditing, id, updateNote, addNote, navigate]);

  const handleCancel = useCallback(() => {
    if (!isEditing) {
      localStorage.removeItem('notlar-draft');
    }
    navigate('/');
  }, [isEditing, navigate]);

  const handleDelete = useCallback(() => {
    if (showDeleteConfirm && id) {
      moveToTrash(id);
      navigate('/');
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  }, [showDeleteConfirm, id, moveToTrash, navigate]);

  // Keyboard shortcut: Ctrl+S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if (e.key === 'Escape') {
        handleCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, handleCancel]);

  const previewHtml = isPreview ? renderMarkdownToHTML(content) : '';

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Editor Header */}
      <section className="p-6 border-b border-outline-variant/10 bg-surface-container-low">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 items-start md:items-end">
          <div className="flex-1 w-full space-y-4">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
                Başlık
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Not başlığı girin..."
                className="w-full bg-transparent border-none p-0 text-3xl font-extrabold tracking-tight text-on-surface focus:ring-0 placeholder:text-surface-variant"
                aria-label="Not başlığı"
              />
            </div>
            {/* Tags */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
                Etiketler (virgülle ayırın)
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full flex items-center gap-1.5 cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => handleRemoveTag(tag)}
                    role="button"
                    aria-label={`${tag} etiketini kaldır`}
                  >
                    #{tag}
                    <span className="material-symbols-outlined text-[12px]">close</span>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={tags.length === 0 ? 'Etiket ekleyin...' : ''}
                  className="bg-transparent border-none p-0 text-sm font-label tracking-wide text-on-surface-variant focus:ring-0 placeholder:text-surface-variant flex-1 min-w-[120px]"
                  aria-label="Yeni etiket"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full md:w-auto pt-4 md:pt-0">
            {/* Preview toggle */}
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors active:scale-95 duration-100 ${
                isPreview
                  ? 'bg-primary/10 text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-highest'
              }`}
              aria-label={isPreview ? 'Düzenleme moduna geç' : 'Önizleme moduna geç'}
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">
                  {isPreview ? 'edit_note' : 'visibility'}
                </span>
                {isPreview ? 'Düzenle' : 'Önizle'}
              </span>
            </button>
            {/* Cancel */}
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-container-highest transition-colors active:scale-95 duration-100"
            >
              İptal
            </button>
            {/* Delete (only for editing) */}
            {isEditing && id && (
              <button
                onClick={handleDelete}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors active:scale-95 duration-100 ${
                  showDeleteConfirm
                    ? 'bg-error/10 text-error'
                    : 'text-on-surface-variant hover:bg-surface-container-highest'
                }`}
                aria-label={showDeleteConfirm ? 'Silmeyi onayla' : 'Çöpe taşı'}
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            )}
            {/* Save */}
            <button
              onClick={handleSave}
              disabled={!title.trim() || isSaving}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-lg shadow-primary-container/20 hover:opacity-90 active:scale-95 duration-100 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </div>
      </section>

      {/* Editor Workspace */}
      <section className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Markdown Input */}
        <div className="flex-1 bg-surface-container-low p-6 md:p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {!isPreview && (
              <div className="flex items-center gap-2 mb-6 text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">edit_note</span>
                <span className="text-xs font-label uppercase tracking-widest">Markdown Düzenleyici</span>
                {lastSaved && (
                  <span className="text-[10px] text-surface-variant ml-auto">
                    Son kayıt: {lastSaved.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            )}
            {isPreview ? (
              <div className="markdown-preview">
                <div
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              </div>
            ) : (
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Not içeriğinizi buraya yazın...&#10;&#10;**kalın**, *italik*, `kod`, # başlık desteklenir"
                spellCheck="false"
                className="editor-textarea w-full h-full min-h-[500px] bg-transparent border-none p-0 font-mono text-sm leading-relaxed text-on-surface-variant resize-none focus:ring-0 focus:outline-none"
                aria-label="Not içeriği"
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
