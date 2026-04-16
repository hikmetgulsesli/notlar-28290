import { useNavigate } from 'react-router-dom';

interface EtiketSonucYokProps {
  tag: string;
}

export function EtiketSonucYok({ tag }: EtiketSonucYokProps) {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl w-full flex flex-col items-center text-center z-10 animate-fade-in">
      {/* Visual Icon Anchor */}
      <div className="relative mb-10">
        <div className="w-32 h-32 editorial-gradient rounded-full opacity-10 absolute inset-0 blur-3xl transform -translate-y-4" />
        <div className="w-24 h-24 glass-panel rounded-[2rem] flex items-center justify-center shadow-2xl relative border border-outline-variant/10">
          <span className="material-symbols-outlined text-6xl text-primary font-light">
            label_off
          </span>
        </div>
      </div>

      {/* Editorial Copy */}
      <h1 className="text-4xl font-extrabold tracking-tighter text-on-surface mb-6 font-headline">
        Bu etikette not yok
      </h1>
      <p className="text-on-surface-variant text-lg leading-relaxed mb-10 max-w-md font-body">
        #{tag} etiketiyle henüz not oluşturulmamış. İlk notunu şimdi oluştur.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => navigate('/editor')}
          className="editorial-gradient text-on-primary px-8 py-3 rounded-lg font-bold text-sm tracking-wide hover:opacity-90 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-blue-900/20"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Yeni Not Oluştur
        </button>
        <button
          onClick={() => navigate('/')}
          className="bg-surface-container-highest text-on-surface-variant px-8 py-3 rounded-lg font-bold text-sm tracking-wide border border-outline-variant/20 hover:bg-surface-bright hover:text-on-surface transition-all active:scale-95"
        >
          Tüm Notlara Dön
        </button>
      </div>

      {/* Tip Component */}
      <div className="mt-16 flex items-center gap-3 px-5 py-3 rounded-full bg-surface-container-low border border-outline-variant/10">
        <span className="material-symbols-outlined text-tertiary text-sm">lightbulb</span>
        <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
          İpucu: Not oluştururken #{tag} etiketini eklemeyi unutmayın
        </span>
      </div>
    </div>
  );
}
