import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useNoteStore } from '../store/useNoteStore';
import { NoteCard } from '../components/NoteCard';
import { EmptyState } from '../components/EmptyState';

type FilterType = 'all' | 'favorites' | 'archive' | 'trash';

export function AnaSayfa() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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
    <div>
      <div className="flex items-baseline justify-between mb-10">
        <h1 className="text-4xl font-extrabold tracking-tighter text-on-background">
          {getTitle()}
        </h1>
        <span className="text-on-surface-variant text-sm font-label uppercase tracking-widest">
          {getCount()} Toplam Not
        </span>
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
              featured={index === 0 && activeTab === 'all'}
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
