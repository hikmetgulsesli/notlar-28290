import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { TagChip } from './TagChip';
import { useTags } from '../hooks/useTags';

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { tags } = useTags();

  const activeTag = searchParams.get('tag');

  const isActive = (tab: string) => {
    if (tab === 'all' && location.pathname === '/' && !activeTag) return true;
    if (tab === 'favorites' && location.pathname === '/?filter=favorites') return true;
    if (tab === 'archive' && location.pathname === '/?filter=archive') return true;
    if (tab === 'trash' && location.pathname === '/?filter=trash') return true;
    return false;
  };

  const handleTagClick = (tag: string) => {
    navigate(`/?tag=${encodeURIComponent(tag)}`);
  };

  const handleClearTag = () => {
    navigate('/');
  };

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 pt-16 bg-slate-900 flex flex-col gap-2 p-4 z-40 border-r border-outline-variant/5">
      <div className="mb-6 px-3">
        <h2 className="font-headline font-bold text-slate-100 tracking-tight text-lg">
          Kütüphane
        </h2>
        <p className="text-slate-400 text-xs tracking-wide">Dijital atölyeniz</p>
      </div>

      <nav className="flex flex-col gap-1">
        {/* All Notes */}
        <button
          onClick={() => navigate('/')}
          className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 font-sans text-sm tracking-wide transition-all ${
            isActive('all')
              ? 'text-blue-400 bg-blue-500/10'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">description</span>
          <span>Tüm Notlar</span>
        </button>

        {/* Favorites */}
        <button
          onClick={() => navigate('/?filter=favorites')}
          className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 font-sans text-sm tracking-wide transition-all cursor-pointer active:opacity-80 ${
            isActive('favorites')
              ? 'text-blue-400 bg-blue-500/10'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">star</span>
          <span>Favoriler</span>
        </button>

        {/* Archive */}
        <button
          onClick={() => navigate('/?filter=archive')}
          className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 font-sans text-sm tracking-wide transition-all cursor-pointer active:opacity-80 ${
            isActive('archive')
              ? 'text-blue-400 bg-blue-500/10'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">archive</span>
          <span>Arşiv</span>
        </button>

        {/* Trash */}
        <button
          onClick={() => navigate('/?filter=trash')}
          className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 font-sans text-sm tracking-wide transition-all cursor-pointer active:opacity-80 ${
            isActive('trash')
              ? 'text-blue-400 bg-blue-500/10'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">delete</span>
          <span>Çöp Kutusu</span>
        </button>
      </nav>

      {/* Tags Section */}
      <div className="mt-8 px-3">
        <h3 className="font-label text-[10px] font-bold text-slate-500 tracking-[0.1em] uppercase mb-4">
          Etiketler
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.length === 0 ? (
            <span className="text-slate-500 text-xs">Henüz etiket yok</span>
          ) : (
            tags.map(tag => (
              <TagChip
                key={tag.name}
                tag={tag.name}
                count={tag.count}
                active={activeTag === tag.name}
                onClick={handleTagClick}
              />
            ))
          )}
        </div>
      </div>

      {activeTag && (
        <div className="mt-4 px-3">
          <button
            onClick={handleClearTag}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">filter_list_off</span>
            <span>Filtreyi temizle</span>
          </button>
        </div>
      )}

      <div className="mt-auto pb-4">
        <button
          className="w-full text-left text-slate-400 px-3 py-2 hover:bg-slate-800 rounded-lg transition-all flex items-center gap-3 font-sans text-sm tracking-wide cursor-pointer"
          aria-label="Yardım"
        >
          <span className="material-symbols-outlined text-[20px]">help_outline</span>
          <span>Yardım</span>
        </button>
        <button
          className="w-full text-left text-slate-400 px-3 py-2 hover:bg-slate-800 rounded-lg transition-all flex items-center gap-3 font-sans text-sm tracking-wide cursor-pointer"
          aria-label="Gizlilik"
        >
          <span className="material-symbols-outlined text-[20px]">lock</span>
          <span>Gizlilik</span>
        </button>
      </div>
    </aside>
  );
}
