import { useNavigate } from 'react-router-dom';

interface HicNotYokProps {
  message?: string;
}

export function HicNotYok({ message }: HicNotYokProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-24 h-24 mb-8 rounded-full bg-surface-container-low flex items-center justify-center">
        <span className="material-symbols-outlined text-5xl text-slate-500">edit_note</span>
      </div>
      <h2 className="text-2xl font-bold text-on-surface mb-2">
        {message || 'Henüz not yok'}
      </h2>
      <p className="text-slate-400 mb-6 max-w-md">
        İlk notunu oluşturmak için butona tıkla
      </p>
      <button
        onClick={() => navigate('/editor')}
        className="primary-gradient text-on-primary font-semibold px-6 py-3 rounded-lg flex items-center gap-2 text-sm transition-transform active:scale-95 duration-100"
      >
        <span className="material-symbols-outlined">add</span>
        <span>İlk notu oluştur</span>
      </button>
    </div>
  );
}
