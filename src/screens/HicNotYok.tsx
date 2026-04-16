import { useNavigate } from 'react-router-dom';

interface HicNotYokProps {
  onCreateNote?: () => void;
}

export function HicNotYok({ onCreateNote }: HicNotYokProps) {
  const navigate = useNavigate();

  const handleCreateNote = () => {
    if (onCreateNote) {
      onCreateNote();
    } else {
      navigate('/editor');
    }
  };

  return (
    <div className="max-w-xl w-full flex flex-col items-center text-center">
      {/* Digital Atelier Visual Anchor */}
      <div className="relative mb-12">
        {/* Layered Paper Aesthetic */}
        <div className="absolute -top-6 -left-6 w-32 h-40 bg-surface-container-low rounded-xl rotate-[-12deg] opacity-40" />
        <div className="absolute -top-4 -right-4 w-36 h-44 bg-surface-container-high rounded-xl rotate-[8deg] opacity-60 shadow-xl" />
        {/* Main Focal Icon Card */}
        <div className="relative w-48 h-56 bg-surface-container-highest rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden border border-outline-variant/10">
          {/* Subtle Gradient Texture */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent" />
          <div className="relative flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                edit_note
              </span>
            </div>
            <div className="space-y-2 px-6 w-full">
              <div className="h-1.5 w-full bg-outline-variant/30 rounded-full" />
              <div className="h-1.5 w-3/4 bg-outline-variant/30 rounded-full" />
              <div className="h-1.5 w-5/6 bg-outline-variant/30 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Text Content */}
      <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-3">
        Henüz notunuz yok.
      </h1>
      <p className="text-lg text-on-surface-variant mb-10 max-w-sm leading-relaxed">
        İlk notunuzu oluşturun! Fikirlerinizi, planlarınızı ve hayallerinizi buraya kaydedin.
      </p>

      {/* Primary Action */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleCreateNote}
          className="group relative flex items-center gap-3 bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary-container/20 hover:shadow-primary-container/40 transition-all active:scale-95 duration-100"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Yeni Not Oluştur
        </button>
        <button
          onClick={() => navigate('/')}
          className="text-on-surface-variant hover:text-primary text-sm font-medium transition-colors py-2 flex items-center gap-2 active:opacity-70"
        >
          <span className="material-symbols-outlined text-sm">auto_fix_high</span>
          Örnek şablonları keşfedin
        </button>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
    </div>
  );
}