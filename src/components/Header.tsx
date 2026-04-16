import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl shadow-2xl shadow-black/40 flex justify-between items-center px-6 py-3">
      <div className="flex items-center gap-8 w-full max-w-7xl mx-auto">
        {/* Brand Logo */}
        <div className="text-2xl font-bold tracking-tighter text-blue-400 font-headline">
          Notlar
        </div>

        {/* Search Bar */}
        <form className="flex-grow max-w-xl relative" onSubmit={handleSearch}>
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            search
          </span>
          <input
            className="w-full bg-slate-900/50 border-none rounded-lg py-2 pl-10 pr-4 text-slate-100 placeholder:text-slate-500 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm"
            placeholder="Notlarda ara..."
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            aria-label="Notlarda ara"
          />
        </form>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/editor')}
            className="primary-gradient text-on-primary font-semibold px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-transform active:scale-95 duration-100"
            aria-label="Yeni not oluştur"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Yeni Not</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/settings')}
              className="p-2 text-slate-400 hover:bg-slate-800/50 rounded-lg transition-colors duration-200"
              aria-label="Ayarlar"
            >
              <span className="material-symbols-outlined">settings</span>
            </button>
            <button
              className="p-2 text-slate-400 hover:bg-slate-800/50 rounded-lg transition-colors duration-200"
              aria-label="Hesap"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
