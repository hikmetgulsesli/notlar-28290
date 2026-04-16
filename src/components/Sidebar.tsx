import { useNavigate, useLocation } from 'react-router-dom';
import { useTags } from '../hooks/useTags';
import { TagChip } from './TagChip';

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { allTags } = useTags();

  const isActive = (tab: string) => {
    if (tab === 'all' && location.pathname === '/') return true;
    if (tab === 'favorites' && location.pathname === '/?filter=favorites') return true;
    if (tab === 'archive' && location.pathname === '/?filter=archive') return true;
    if (tab === 'trash' && location.pathname === '/?filter=trash') return true;
    return false;
  };

  const handleTagClick = (tag: string) => {
    navigate(`/tags/${encodeURIComponent(tag)}`);
  };

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 pt-16 bg-slate-900 flex flex-col gap-2 p-4 z-40">
      <div className="mb-4 px-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
          Kütüphane
        </h3>
        <p className="text-[10px] text-slate-600">Dijital atölyeniz</p>
      </div>

      <nav className="flex flex-col gap-1">
        <button
          onClick={() => navigate('/')}
          className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 font-sans text-sm tracking-wide transition-all cursor-pointer active:opacity-80 group ${
            isActive('all')
              ? 'text-blue-400 bg-blue-500/10'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">description</span>
          <span>Tüm Notlar</span>
        </button>

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

      {/* Tags Section - Dynamic */}
      <div className="mt-8 px-3">
        <h3 className="font-label text-[10px] font-bold text-slate-500 tracking-[0.1em] uppercase mb-4">
          Etiketler
        </h3>
        {allTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {allTags.slice(0, 10).map(({ name, count }) => (
              <TagChip
                key={name}
                tag={name}
                count={count}
                onClick={handleTagClick}
              />
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-slate-600">
            Henüz etiket yok. Not eklerken etiket ekleyin.
          </p>
        )}
      </div>

      <div className="mt-auto pb-4">
        <button
          className="w-full text-left text-slate-400 px-3 py-2 hover:bg-slate-800 rounded-lg transition-all flex items-center gap-3 font-sans text-sm tracking-wide"
          aria-label="Yardım"
        >
          <span className="material-symbols-outlined text-[20px]">help_outline</span>
          <span>Yardım</span>
        </button>
        <button
          className="w-full text-left text-slate-400 px-3 py-2 hover:bg-slate-800 rounded-lg transition-all flex items-center gap-3 font-sans text-sm tracking-wide"
          aria-label="Gizlilik"
        >
          <span className="material-symbols-outlined text-[20px]">lock</span>
          <span>Gizlilik</span>
        </button>
      </div>
    </aside>
  );
}
