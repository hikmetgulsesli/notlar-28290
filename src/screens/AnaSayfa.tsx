import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useNoteStore } from '../store/useNoteStore';
import { NoteCard } from '../components/NoteCard';
import { EmptyState } from '../components/EmptyState';
import { EtiketSonucYok } from '../screens/EtiketSonucYok';

type FilterType = 'all' | 'favorites' | 'archive' | 'trash';

export function AnaSayfa() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const filterParam = searchParams.get('filter') as FilterType | null;
  const activeTag = searchParams.get('tag');
  const [activeTab, setActiveTab] = useState<FilterType>(filterParam || 'all');

  const { notes, toggleFavorite, moveToTrash } = useNoteStore();

  const filteredNotes = useMemo(() => {
    let filtered = notes;

    // Apply tag filter first
    if (activeTag) {
      filtered = filtered.filter(n => n.tags.includes(activeTag));
    }

    // Apply tab filter
    switch (activeTab) {
      case 'favorites':
        filtered = filtered.filter(n => n.isFavorite && !n.isArchived && !n.isTrash);
        break;
      case 'archive':
        filtered = filtered.filter(n => n.isArchived && !n.isTrash);
        break;
      case 'trash':
        filtered = filtered.filter(n => n.isTrash);
        break;
      default:
        filtered = filtered.filter(n => !n.isArchived && !n.isTrash);
    }

    return filtered;
  }, [notes, activeTab, activeTag]);

  const totalCount = notes.filter(n => !n.isArchived && !n.isTrash).length;
  const favoriteCount = notes.filter(n => n.isFavorite && !n.isArchived && !n.isTrash).length;
  const archiveCount = notes.filter(n => n.isArchived && !n.isTrash).length;
  const trashCount = notes.filter(n => n.isTrash).length;

  const getTitle = () => {
    if (activeTag) {
      return `#${activeTag}`;
    }
    switch (activeTab) {
      case 'favorites':
        return 'Favoriler';
      case 'archive':
        return 'Arşiv';
      case 'trash':
        return 'Çöp Kutusu';
      default:
        return 'Tüm Notlar';
    }
  };

  const getCount = () => {
    switch (activeTab) {
      case 'favorites':
        return favoriteCount;
      case 'archive':
        return archiveCount;
      case 'trash':
        return trashCount;
      default:
        return totalCount;
    }
  };

  // Show "no notes with this tag" state
  if (activeTag && filteredNotes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <EtiketSonucYok tag={activeTag} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-10">
        <h1 className="text-4xl font-extrabold tracking-tighter text-on-background">
          {getTitle()}
        </h1>
        <span className="text-on-surface-variant text-sm font-label uppercase tracking-widest">
          {getCount()} Toplam Not
        </span>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-4 mb-8 border-b border-outline-variant/5 pb-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'all'
              ? 'text-blue-400 bg-blue-500/10'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-sm">description</span>
          <span>Tüm Notlar</span>
          <span className="text-xs opacity-60">{totalCount}</span>
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'favorites'
              ? 'text-blue-400 bg-blue-500/10'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-sm">star</span>
          <span>Favoriler</span>
          <span className="text-xs opacity-60">{favoriteCount}</span>
        </button>
        <button
          onClick={() => setActiveTab('archive')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'archive'
              ? 'text-blue-400 bg-blue-500/10'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-sm">archive</span>
          <span>Arşiv</span>
          <span className="text-xs opacity-60">{archiveCount}</span>
        </button>
        <button
          onClick={() => setActiveTab('trash')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'trash'
              ? 'text-blue-400 bg-blue-500/10'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-sm">delete</span>
          <span>Çöp Kutusu</span>
          <span className="text-xs opacity-60">{trashCount}</span>
        </button>
      </div>

      {filteredNotes.length === 0 ? (
        <EmptyState type={activeTab} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note, index) => (
            <NoteCard
              key={note.id}
              note={note}
              onToggleFavorite={toggleFavorite}
              onDelete={moveToTrash}
              featured={index === 0 && activeTab === 'all' && !activeTag}
            />
          ))}
        </div>
      )}

      {/* Floating Action Button for Mobile */}
      <button
        className="md:hidden fixed bottom-8 right-8 w-14 h-14 primary-gradient rounded-full shadow-2xl flex items-center justify-center text-on-primary z-50 active:scale-90 transition-transform"
        onClick={() => navigate('/editor')}
        aria-label="Yeni not oluştur"
      >
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          add
        </span>
      </button>
    </div>
  );
}
