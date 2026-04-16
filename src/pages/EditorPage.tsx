import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNoteStore } from '../store/useNoteStore';

export function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notes, addNote, updateNote } = useNoteStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  const isEditing = Boolean(id);

  useEffect(() => {
    if (id) {
      const note = notes.find(n => n.id === id);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setTags(note.tags);
      }
    }
  }, [id, notes]);

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSave = () => {
    if (!title.trim()) return;

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
    }

    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold tracking-tighter text-on-background">
          {isEditing ? 'Notu Düzenle' : 'Yeni Not'}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isPreview
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            {isPreview ? 'Düzenle' : 'Önizleme'}
          </button>
          <button
            onClick={handleSave}
            className="primary-gradient text-on-primary font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition-transform active:scale-95"
          >
            <span>Kaydet</span>
            <span className="material-symbols-outlined text-sm">check</span>
          </button>
        </div>
      </div>

      <div className="bg-surface-container-low rounded-xl p-6 space-y-6">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Not başlığı..."
          className="w-full bg-transparent text-3xl font-bold text-on-surface placeholder:text-slate-500 focus:outline-none"
          aria-label="Not başlığı"
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 items-center">
          {tags.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full flex items-center gap-2"
            >
              #{tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-error"
                aria-label={`${tag} etiketini kaldır`}
              >
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="Etiket ekle..."
            className="bg-transparent text-sm text-on-surface placeholder:text-slate-500 focus:outline-none w-32"
            aria-label="Yeni etiket"
          />
        </div>

        {/* Content */}
        {isPreview ? (
          <div className="prose prose-invert max-w-none text-on-surface">
            <pre className="whitespace-pre-wrap font-mono text-sm">{content || 'İçerik yok...'}</pre>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Not içeriğini yaz..."
            className="w-full min-h-[400px] bg-transparent text-on-surface font-mono text-sm placeholder:text-slate-500 focus:outline-none resize-none"
            aria-label="Not içeriği"
          />
        )}
      </div>
    </div>
  );
}
