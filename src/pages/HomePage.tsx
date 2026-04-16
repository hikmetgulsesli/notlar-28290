import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNoteStore } from '../store/useNoteStore';
import { NoteCard } from '../components/NoteCard';
import { Sidebar } from '../components/Sidebar';
import { EmptyState } from '../components/EmptyState';

type FilterType = 'all' | 'favorites' | 'archive' | 'trash';

export function HomePage() {
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get('filter') as FilterType | null;
  const [activeTab, setActiveTab] = useState<FilterType>(filterParam || 'all');

  const { notes, toggleFavorite, moveToTrash } = useNoteStore();

  const filteredNotes = useMemo(() => {
    switch (activeTab) {
      case 'favorites':
        return notes.filter(n => n.isFavorite && !n.isArchived && !n.isTrash);
      case 'archive':
        return notes.filter(n => n.isArchived && !n.isTrash);
      case 'trash':
        return notes.filter(n => n.isTrash);
      default:
        return notes.filter(n => !n.isArchived && !n.isTrash);
    }
  }, [notes, activeTab]);

  const totalCount = notes.filter(n => !n.isArchived && !n.isTrash).length;
  const favoriteCount = notes.filter(n => n.isFavorite && !n.isArchived && !n.isTrash).length;
  const archiveCount = notes.filter(n => n.isArchived && !n.isTrash).length;
  const trashCount = notes.filter(n => n.isTrash).length;

  const getTitle = () => {
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

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow pl-0">
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

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <EmptyState type={activeTab} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onToggleFavorite={toggleFavorite}
                onDelete={moveToTrash}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
